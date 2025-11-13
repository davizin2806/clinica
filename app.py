import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. Configuração Inicial ---
app = Flask(__name__)
CORS(app)

# --- 2. Configuração da Conexão com o Banco ---
DB_CONFIG = {
    'driver': '{ODBC Driver 17 for SQL Server}',
    'server': 'DESKTOP-18TVE6E', # SEU SERVIDOR
    'database': 'CLINICASJVI',
    'username': 'api_login',
    'password': 'UmaSenhaForteParaSuaAPI_123!' # SUA SENHA
}

def get_db_connection():
    """Cria e retorna uma nova conexão com o banco de dados."""
    try:
        conn_str = (
            f"DRIVER={DB_CONFIG['driver']};"
            f"SERVER={DB_CONFIG['server']};"
            f"DATABASE={DB_CONFIG['database']};"
            f"UID={DB_CONFIG['username']};"
            f"PWD={DB_CONFIG['password']};"
        )
        conn = pyodbc.connect(conn_str)
        return conn
    except Exception as e:
        print(f" Erro ao conectar ao banco: {e}")
        return None

# --- 3. Funções Auxiliares (Helpers) ---
def rows_to_dict_list(cursor):
    columns = [column[0] for column in cursor.description]
    return [dict(zip(columns, row)) for row in cursor.fetchall()]

def row_to_dict(cursor, row):
    if row is None:
        return None
    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, row))

# --- 4. Rota de Login ---
@app.route('/api/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'sucesso': False, 'mensagem': 'Erro ao conectar ao banco de dados.'}), 500

        cursor = conn.cursor()
        cursor.execute("""
            SELECT nome, tipo_usuario, id_paciente_fk, id_medico_fk 
            FROM usuarios 
            WHERE email = ? AND senha = ?
        """, (email, senha))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if row:
            nome, tipo_usuario, id_paciente, id_medico = row
            return jsonify({
                'sucesso': True,
                'mensagem': f'Bem-vindo(a), {nome}!',
                'tipo_usuario': tipo_usuario,
                'nome': nome,
                'id_paciente': id_paciente,
                'id_medico': id_medico
            })
        else:
            return jsonify({'sucesso': False, 'mensagem': 'E-mail ou senha incorretos.'}), 401

    except Exception as e:
        print(' Erro ao processar login:', e)
        return jsonify({'sucesso': False, 'mensagem': 'Erro interno no servidor.'}), 500

# --- 5. Rotas de Cadastros (CRUD) ---

# --- ESPECIALIDADES (Admin) ---
@app.route('/api/especialidades', methods=['GET', 'POST'])
def handle_especialidades():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        if request.method == 'GET':
            # CORREÇÃO AQUI: Adicionado 'sp_'
            cursor.execute("EXEC Especialidade_ListarTodos") 
            return jsonify(rows_to_dict_list(cursor)), 200
        elif request.method == 'POST':
            dados = request.get_json()
            cursor.execute("EXEC Especialidade_Cadastrar @nome=?", (dados['nome'],))
            conn.commit()
            return jsonify({"message": "Especialidade cadastrada!"}), 201
    except pyodbc.Error as e:
        return jsonify({"message": f"{e.args[1]}"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ROTA NOVA (para Admin)
@app.route('/api/especialidades/<int:id_especialidade>', methods=['DELETE'])
def delete_especialidade(id_especialidade):
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Especialidade_Remover @id_especialidade=?", (id_especialidade,))
        conn.commit()
        return jsonify({"message": "Especialidade removida com sucesso."}), 200
    except pyodbc.Error as e:
        return jsonify({"message": f"{e.args[1]}"}), 400 # Retorna erro da SP (ex: "em uso")
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- EXAMES (GET para listas) ---
@app.route('/api/exames', methods=['GET'])
def get_exames():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        # CORREÇÃO AQUI: Adicionado 'sp_'
        cursor.execute("EXEC Exame_ListarTodos") 
        return jsonify(rows_to_dict_list(cursor)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- CONVÊNIOS (Admin) ---
@app.route('/api/convenios', methods=['GET', 'POST'])
def handle_convenios():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        if request.method == 'GET':
            cursor.execute("EXEC sp_Convenio_ListarTodos")
            return jsonify(rows_to_dict_list(cursor)), 200
        
        elif request.method == 'POST':
            # ROTA NOVA (para Admin)
            dados = request.get_json()
            params = (
                dados['nome'], dados['cnpj'], dados['telefone'],
                dados.get('email', 'email@padrao.com'),
                dados.get('logradouro', 'Rua Nao Informada'),
                dados.get('numero', 'S/N'),
                dados.get('complemento', ''),
                dados.get('bairro', 'Bairro Nao Informado'),
                dados.get('cidade', 'Cidade'),
                dados.get('estado', 'ES'),
                dados.get('cep', '00000-000')
            )
            cursor.execute("EXEC sp_Convenio_Cadastrar @nome=?, @cnpj=?, @telefone=?, @email=?, @logradouro=?, @numero=?, @complemento=?, @bairro=?, @cidade=?, @estado=?, @cep=?", params)
            conn.commit()
            return jsonify({"message": "Convênio cadastrado!"}), 201
            
    except pyodbc.Error as e:
        return jsonify({"message": f"{e.args[1]}"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- MÉDICOS (Admin) ---
@app.route('/api/medicos', methods=['GET'])
def get_medicos():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Medico_ListarTodos")
        return jsonify(rows_to_dict_list(cursor)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ROTA NOVA (para Admin)
@app.route('/api/cadastrar_medico', methods=['POST'])
def cadastrar_medico():
    dados = request.json
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        params = (
            dados['email'], dados['senha'],
            dados['nome'], dados['crm'], 
            dados['telefone'], dados['id_especialidade'],
            dados['logradouro'], dados['numero'], dados['complemento'],
            dados['bairro'], dados['cidade'], dados['estado'], dados['cep']
        )
        # Chama a SP correta que cria login
        cursor.execute("EXEC sp_Medico_Cadastrar @email=?, @senha=?, @nome=?, @crm=?, @telefone=?, @id_especialidade=?, @logradouro=?, @numero=?, @complemento=?, @bairro=?, @cidade=?, @estado=?, @cep=?", params)
        conn.commit()
        return jsonify({"message": "Médico e Login criados com sucesso!"}), 201
    except pyodbc.Error as e:
        return jsonify({"message": f"{e.args[1]}"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- PACIENTES ---
@app.route('/api/pacientes', methods=['GET'])
def get_pacientes():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Paciente_ListarTodos")
        return jsonify(rows_to_dict_list(cursor)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/pacientes/cpf/<cpf>', methods=['GET'])
def get_paciente_by_cpf(cpf):
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Paciente_BuscarPorCPF @cpf=?", (cpf,))
        paciente = row_to_dict(cursor, cursor.fetchone())
        if paciente is None:
            return jsonify({"message": "Paciente não encontrado"}), 404
        return jsonify(paciente), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/pacientes/<int:id_paciente>', methods=['GET', 'PUT'])
def handle_paciente_by_id(id_paciente):
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        if request.method == 'GET':
            cursor.execute("EXEC sp_Paciente_BuscarPorID @id_paciente=?", (id_paciente,))
            paciente = row_to_dict(cursor, cursor.fetchone())
            if paciente is None:
                return jsonify({"message": "Paciente não encontrado"}), 404
            return jsonify(paciente), 200

        elif request.method == 'PUT':
            dados = request.get_json()
            id_convenio = dados.get('id_convenio') or None
            if id_convenio == "": id_convenio = None
            params = (
                id_paciente,
                dados['nome'], dados['cpf'], dados['data_nascimento'], dados['telefone'], dados['email'], id_convenio,
                dados['id_endereco'],
                dados['logradouro'], dados['numero'], dados['complemento'],
                dados['bairro'], dados['cidade'], dados['estado'], dados['cep']
            )
            cursor.execute("EXEC sp_Paciente_Atualizar @id_paciente=?, @nome=?, @cpf=?, @data_nascimento=?, @telefone=?, @email=?, @id_convenio=?, @id_endereco=?, @logradouro=?, @numero=?, @complemento=?, @bairro=?, @cidade=?, @estado=?, @cep=?", params)
            conn.commit()
            return jsonify({"message": "Dados do paciente atualizados com sucesso!"}), 200
    except pyodbc.Error as e:
        return jsonify({"message": f"{e.args[1]}"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/cadastrar_paciente', methods=['POST'])
def rota_cadastrar_paciente():
    dados = request.get_json()
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"message": "Erro de conexão com o banco de dados"}), 500
        
        id_convenio = dados.get('id_convenio') or None
        if id_convenio == "": id_convenio = None

        cursor = conn.cursor()
        sql_exec = """
            EXEC sp_Paciente_Cadastrar
                @email=?, @senha=?,
                @nome=?, @cpf=?, @data_nascimento=?, @telefone=?, @id_convenio=?,
                @logradouro=?, @numero=?, @complemento=?, @bairro=?, @cidade=?, @estado=?, @cep=?
        """
        cursor.execute(sql_exec, (
            dados['email'], dados['senha'],
            dados['nome'], dados['cpf'], dados['data_nascimento'], dados['telefone'], id_convenio,
            dados['logradouro'], dados['numero'], dados['complemento'], dados['bairro'], dados['cidade'], dados['estado'], dados['cep']
        ))
        conn.commit()
        return jsonify({"message": "Paciente e Login criados com sucesso!"}), 201
    except pyodbc.Error as e:
        return jsonify({"message": f"{e.args[1]}"}), 400
    except Exception as e:
        return jsonify({"message": f"Erro: {str(e)}"}), 500
    finally:
        cursor.close()
        conn.close()

# --- 6. Rotas de Ações da Clínica ---
@app.route('/api/atendimentos', methods=['POST'])
def handle_atendimentos():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        dados = request.get_json()
        params = (
            int(dados['id_paciente']), 
            int(dados['id_medico']), 
            dados['data_atendimento'], 
            dados['observacoes']
        )
        cursor.execute("EXEC sp_Atendimento_Agendar @id_paciente=?, @id_medico=?, @data_atendimento=?, @observacoes=?", params)
        conn.commit()
        return jsonify({"message": "Atendimento agendado com sucesso!"}), 201
    except pyodbc.Error as e:
        return jsonify({"message": f"{e.args[1]}"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/exames_realizados', methods=['POST'])
def handle_exames_realizados():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        dados = request.get_json()
        params = (
            dados['id_paciente'], 
            dados['id_exame'], 
            dados['data_realizacao']
        )
        cursor.execute("EXEC sp_ExameRealizado_Registrar @id_paciente=?, @id_exame=?, @data_realizacao=?", params)
        conn.commit()
        return jsonify({"message": "Exame registrado com sucesso!"}), 201
    except pyodbc.Error as e:
        return jsonify({"message": f"{e.args[1]}"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- 7. Rotas de Descontos (Admin) ---
@app.route('/api/descontos', methods=['POST'])
def handle_descontos():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        dados = request.get_json()
        params = (
            dados['id_exame'], 
            dados['id_convenio'], 
            dados['percentual_desconto']
        )
        cursor.execute("EXEC sp_DescontoConvenio_Definir @id_exame=?, @id_convenio=?, @percentual_desconto=?", params)
        conn.commit()
        return jsonify({"message": "Desconto definido com sucesso!"}), 201
    except pyodbc.Error as e:
        return jsonify({"message": f"{e.args[1]}"}), 400
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/descontos/<int:id_convenio>', methods=['GET'])
def get_descontos_por_convenio(id_convenio):
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Relatorio_DescontosPorConvenio @id_convenio=?", (id_convenio,))
        dados = rows_to_dict_list(cursor)
        return jsonify(dados), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# --- 8. Rotas de Relatórios (GET) ---
@app.route('/api/relatorios/atendimentos_medico', methods=['GET'])
def relatorio_atendimentos_medico():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Relatorio_AtendimentosPorMedico")
        return jsonify(rows_to_dict_list(cursor)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/relatorios/atendimentos_convenio', methods=['GET'])
def relatorio_atendimentos_convenio():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Relatorio_AtendimentosPorConvenio")
        return jsonify(rows_to_dict_list(cursor)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/relatorios/ficha_exames/<int:id_paciente>', methods=['GET'])
def relatorio_ficha_exames(id_paciente):
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Relatorio_FichaCliente_Exames @id_paciente=?", (id_paciente,))
        return jsonify(rows_to_dict_list(cursor)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/relatorios/ficha_atendimentos/<int:id_paciente>', methods=['GET'])
def relatorio_ficha_atendimentos(id_paciente):
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Relatorio_FichaCliente_Atendimentos @id_paciente=?", (id_paciente,))
        return jsonify(rows_to_dict_list(cursor)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/relatorios/historico_medico/<int:id_medico>', methods=['GET'])
def relatorio_historico_medico(id_medico):
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Relatorio_HistoricoPorMedico @id_medico=?", (id_medico,))
        return jsonify(rows_to_dict_list(cursor)), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- 9. Rodar o servidor ---
if __name__ == '__main__':
    # ⚠️ MUDE O 'host' para o seu IP de rede
    app.run(host='0.0.0.0', port=5000, debug=True)
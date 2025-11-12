import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. Configuração Inicial ---
app = Flask(__name__)
CORS(app)

# --- 2. Configuração da Conexão com o Banco ---
DB_CONFIG = {
    'driver': '{ODBC Driver 17 for SQL Server}',
    'server': 'DESKTOP-18TVE6E',        # SEU SERVIDOR
    'database': 'CLINICASJVI',
    'username': 'api_login',                 # SEU LOGIN SQL
    'password': 'UmaSenhaForteParaSuaAPI_123!' # SUA SENHA SQL
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

# --- 4. Rota de Login (Melhorada) ---
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
        # Modificado para buscar os IDs
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

# --- ESPECIALIDADES ---
@app.route('/api/especialidades', methods=['GET'])
def get_especialidades():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Especialidade_ListarTodos")
        especialidades = rows_to_dict_list(cursor)
        return jsonify(especialidades), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- EXAMES ---
@app.route('/api/exames', methods=['GET'])
def get_exames():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Exame_ListarTodos")
        exames = rows_to_dict_list(cursor)
        return jsonify(exames), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- CONVÊNIOS ---
@app.route('/api/convenios', methods=['GET'])
def get_convenios():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Convenio_ListarTodos")
        convenios = rows_to_dict_list(cursor)
        return jsonify(convenios), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- MÉDICOS ---
@app.route('/api/medicos', methods=['GET'])
def get_medicos():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Medico_ListarTodos")
        medicos = rows_to_dict_list(cursor)
        return jsonify(medicos), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- PACIENTES ---
# Em app.py, substitua sua rota 'rota_cadastrar_paciente' por esta:

@app.route('/api/cadastrar_paciente', methods=['POST'])
def rota_cadastrar_paciente():
    dados = request.get_json()
    print(f"📩 Dados recebidos: {dados}")

    try:
        # Novos campos de login
        email = dados['email']
        senha = dados['senha'] # Campo novo!
        
        # Campos de paciente
        nome = dados['nome']
        cpf = dados['cpf']
        data_nascimento = dados['data_nascimento']
        telefone = dados['telefone']
        id_convenio = dados.get('id_convenio') or None
        if id_convenio == "": id_convenio = None
        
        # Campos de endereço
        logradouro = dados['logradouro']
        numero = dados['numero']
        complemento = dados['complemento']
        bairro = dados['bairro']
        cidade = dados['cidade']
        estado = dados['estado']
        cep = dados['cep']

        conn = get_db_connection()
        if not conn:
            return jsonify({"message": "Erro de conexão com o banco de dados"}), 500

        cursor = conn.cursor()
        
        # A SP agora tem 15 parâmetros!
        sql_exec = """
            EXEC sp_Paciente_Cadastrar
                @email=?, @senha=?,
                @nome=?, @cpf=?, @data_nascimento=?, @telefone=?, @id_convenio=?,
                @logradouro=?, @numero=?, @complemento=?, @bairro=?, @cidade=?, @estado=?, @cep=?
        """
        cursor.execute(sql_exec, (
            email, senha,
            nome, cpf, data_nascimento, telefone, id_convenio,
            logradouro, numero, complemento, bairro, cidade, estado, cep
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Paciente e Login criados com sucesso!"}), 201

    except pyodbc.Error as e:
        # Captura o erro do RAISERROR (ex: "E-mail duplicado")
        # O e.args[1] contém a mensagem de erro vinda do SQL
        return jsonify({"message": f"Erro do banco: {e.args[1]}"}), 400
    except Exception as e:
        return jsonify({"message": f"Erro: {str(e)}"}), 500

@app.route('/api/pacientes', methods=['GET'])
def get_pacientes():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Paciente_ListarTodos")
        pacientes = rows_to_dict_list(cursor)
        return jsonify(pacientes), 200
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
            # Busca paciente e endereço por ID
            cursor.execute("""
                SELECT p.*, e.* FROM Paciente p 
                JOIN Endereco e ON p.id_endereco = e.id_endereco 
                WHERE p.id_paciente = ?
            """, (id_paciente,))
            paciente = row_to_dict(cursor, cursor.fetchone())
            if paciente is None:
                return jsonify({"message": "Paciente não encontrado"}), 404
            return jsonify(paciente), 200

        elif request.method == 'PUT':
            # Atualiza paciente
            dados = request.get_json()
            id_convenio = dados.get('id_convenio') or None
            if id_convenio == "": id_convenio = None
            
            params = (
                id_paciente,
                dados['nome'], dados['cpf'], dados['data_nascimento'], dados['telefone'], dados['email'], id_convenio,
                dados['id_endereco'], # ID do endereço existente
                dados['logradouro'], dados['numero'], dados['complemento'],
                dados['bairro'], dados['cidade'], dados['estado'], dados['cep']
            )
            # Garanta que sp_Paciente_Atualizar existe no seu banco!
            cursor.execute("EXEC sp_Paciente_Atualizar @id_paciente=?, @nome=?, @cpf=?, @data_nascimento=?, @telefone=?, @email=?, @id_convenio=?, @id_endereco=?, @logradouro=?, @numero=?, @complemento=?, @bairro=?, @cidade=?, @estado=?, @cep=?", params)
            conn.commit()
            return jsonify({"message": "Dados do paciente atualizados com sucesso!"}), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500
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
            dados['id_paciente'], 
            dados['id_medico'], 
            dados['data_atendimento'], 
            dados['observacoes']
        )
        cursor.execute("EXEC sp_Atendimento_Agendar @id_paciente=?, @id_medico=?, @data_atendimento=?, @observacoes=?", params)
        conn.commit()
        return jsonify({"message": "Atendimento agendado com sucesso!"}), 201
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
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- 7. Rotas de Relatórios (GET) ---

@app.route('/api/relatorios/resumo_exames', methods=['GET'])
def relatorio_resumo_exames():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Relatorio_ResumoExames")
        dados = rows_to_dict_list(cursor)
        return jsonify(dados), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route('/api/relatorios/atendimentos_medico', methods=['GET'])
def relatorio_atendimentos_medico():
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Relatorio_AtendimentosPorMedico")
        dados = rows_to_dict_list(cursor)
        return jsonify(dados), 200
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
        dados = rows_to_dict_list(cursor)
        return jsonify(dados), 200
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
        dados = rows_to_dict_list(cursor)
        return jsonify(dados), 200
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
        dados = rows_to_dict_list(cursor)
        return jsonify(dados), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# ... (adicionar junto com as outras rotas) ...

@app.route('/api/relatorios/historico_medico/<int:id_medico>', methods=['GET'])
def relatorio_historico_medico(id_medico):
    conn = get_db_connection()
    if conn is None: return jsonify({"message": "Erro de conexão"}), 500
    cursor = conn.cursor()
    try:
        cursor.execute("EXEC sp_Relatorio_HistoricoPorMedico @id_medico=?", (id_medico,))
        dados = rows_to_dict_list(cursor)
        return jsonify(dados), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# --- 8. Rodar o servidor ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
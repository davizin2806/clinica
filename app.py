import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. Configuração Inicial ---
app = Flask(__name__)
CORS(app)

# --- 2. Configuração da Conexão com o Banco ---
DB_CONFIG = {
    'driver': '{ODBC Driver 17 for SQL Server}',
    'server': 'DESKTOP-18TVE6E',        # servidor remoto
    'database': 'CLINICASJVI',
    'username': 'api_login',
    'password': 'UmaSenhaForteParaSuaAPI_123!'
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
        return pyodbc.connect(conn_str)
    except Exception as e:
        print(f" Erro ao conectar ao banco: {e}")
        return None

# --- 3. Cadastro de Paciente (sua SP continua igual) ---
@app.route('/api/cadastrar_paciente', methods=['POST'])
def rota_cadastrar_paciente():
    dados = request.get_json()
    print(f"📩 Dados recebidos: {dados}")

    try:
        nome = dados['nome']
        cpf = dados['cpf']
        data_nascimento = dados['data_nascimento']
        telefone = dados['telefone']
        email = dados['email']
        id_convenio = dados.get('id_convenio') or None
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
        sql_exec = """
            EXEC sp_Paciente_Cadastrar
                @nome=?, @cpf=?, @data_nascimento=?, @telefone=?, @email=?, @id_convenio=?,
                @logradouro=?, @numero=?, @complemento=?, @bairro=?, @cidade=?, @estado=?, @cep=?
        """
        cursor.execute(sql_exec, (
            nome, cpf, data_nascimento, telefone, email, id_convenio,
            logradouro, numero, complemento, bairro, cidade, estado, cep
        ))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Paciente cadastrado com sucesso!"}), 201

    except Exception as e:
        return jsonify({"message": f"Erro: {e}"}), 500


# --- 4. Login (verificação de e-mail e senha) ---
@app.route('/api/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get('email')
    senha = dados.get('senha')

    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({'sucesso': False, 'mensagem': 'Erro ao conectar ao banco de dados.'})

        cursor = conn.cursor()
        cursor.execute("SELECT nome, tipo_usuario FROM usuarios WHERE email = ? AND senha = ?", (email, senha))
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if row:
            nome, tipo_usuario = row
            return jsonify({
                'sucesso': True,
                'mensagem': f'Bem-vindo(a), {nome}!',
                'tipo_usuario': tipo_usuario
            })
        else:
            return jsonify({'sucesso': False, 'mensagem': 'E-mail ou senha incorretos.'})

    except Exception as e:
        print(' Erro ao processar login:', e)
        return jsonify({'sucesso': False, 'mensagem': 'Erro interno no servidor.'})


# --- 5. Rodar o servidor ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

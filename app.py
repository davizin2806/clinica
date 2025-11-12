import pyodbc
from flask import Flask, request, jsonify
from flask_cors import CORS

# --- 1. Configuração Inicial ---
app = Flask(__name__)
CORS(app)  

# --- 2. String de Conexão com Autenticação SQL ---
# ⚠️ AGORA VAMOS USAR O USUÁRIO E SENHA QUE CRIAMOS
DB_CONFIG = {
    'driver': '{ODBC Driver 17 for SQL Server}', 
    'server': 'DESKTOP-18TVE6E',  # O nome que funcionou antes
    'database': 'CLINICASJVI',
    'username': 'api_login',                 
    'password': 'UmaSenhaForteParaSuaAPI_123!' 
}

def get_db_connection():
    """Cria e retorna uma nova conexão com o banco de dados."""
    try:
        # A string de conexão agora é mais simples
        conn_str = (
            f"DRIVER={DB_CONFIG['driver']};"
            f"SERVER={DB_CONFIG['server']};"
            f"DATABASE={DB_CONFIG['database']};"
            f"UID={DB_CONFIG['username']};"     # <-- User ID
            f"PWD={DB_CONFIG['password']};"     # <-- Password
        )
        # Note que "Trusted_Connection=yes;" FOI REMOVIDO
        
        conn = pyodbc.connect(conn_str)
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco: {e}")
        return None

# --- 3. Rota da API: Cadastrar Paciente ---
@app.route('/api/cadastrar_paciente', methods=['POST'])
def rota_cadastrar_paciente():
    """
    Recebe os dados do formulário HTML e executa a SP sp_Paciente_Cadastrar
    """
    # Pega os dados JSON enviados pelo JavaScript
    dados = request.get_json()

    # Log para depuração (você verá isso no terminal do Flask)
    print(f"Dados recebidos: {dados}")

    try:
        # Pega os dados do JSON (os nomes devem bater com o JavaScript)
        nome = dados['nome']
        cpf = dados['cpf']
        data_nascimento = dados['data_nascimento']
        telefone = dados['telefone']
        email = dados['email']
        id_convenio = dados['id_convenio']
        
        # Trata o convênio "Nenhum/Particular"
        if id_convenio == "":
            id_convenio = None # Envia NULL para o banco

        # Dados do Endereço
        logradouro = dados['logradouro']
        numero = dados['numero']
        complemento = dados['complemento']
        bairro = dados['bairro']
        cidade = dados['cidade']
        estado = dados['estado']
        cep = dados['cep']

        conn = get_db_connection()
        if conn is None:
            return jsonify({"message": "Erro de conexão com o banco de dados"}), 500

        cursor = conn.cursor()

        # --- O Ponto Principal: Executando a Stored Procedure ---
        sql_exec = """
            EXEC sp_Paciente_Cadastrar
                @nome = ?,
                @cpf = ?,
                @data_nascimento = ?,
                @telefone = ?,
                @email = ?,
                @id_convenio = ?,
                @logradouro = ?,
                @numero = ?,
                @complemento = ?,
                @bairro = ?,
                @cidade = ?,
                @estado = ?,
                @cep = ?
        """
        
        # Executa a SP passando os parâmetros de forma segura
        cursor.execute(sql_exec, (
            nome, cpf, data_nascimento, telefone, email, id_convenio,
            logradouro, numero, complemento, bairro, cidade, estado, cep
        ))
        
        conn.commit()  # Confirma a transação
        cursor.close()
        conn.close()

        # Retorna uma resposta de sucesso para o front-end
        return jsonify({"message": "Paciente cadastrado com sucesso!"}), 201

    except pyodbc.Error as e:
        # Captura erros do SQL (ex: CPF duplicado)
        return jsonify({"message": f"Erro do banco de dados: {e}"}), 500
    except Exception as e:
        # Captura outros erros (ex: 'nome' não enviado no JSON)
        return jsonify({"message": f"Erro inesperado: {str(e)}"}), 500

# --- 4. Roda o Servidor Flask ---
if __name__ == '__main__':
    # Roda a API na porta 5000 (http://127.0.0.1:5000)
    app.run(debug=True, port=5000)
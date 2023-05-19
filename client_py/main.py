from socketIO_client import SocketIO, LoggingNamespace

express_server_port = 4000

print("Inicio...")
socketIO = SocketIO('localhost', express_server_port)
print("Socket encontrado...")

def on_sign_in_response():
    print('Successfully signed in!')

def on_ready_response(*args):
    print('On ready msg: ', args)

def sign_in():
    socketIO.emit('signin', { 'user_name': "andres_dlr", 'tournament_id': 10, 'user_role': 'player' })

socketIO.on('connect', sign_in)
socketIO.on('ok_signin', on_sign_in_response)
socketIO.on('ready', on_ready_response)
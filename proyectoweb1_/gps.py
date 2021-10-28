
import time, serial, threading
from socket import socket, AF_INET, SOCK_DGRAM

def conectar():
    #try: 
    '''serialArduino.write(b'a')
    for i in range(3):
        #cad =serialArduino.readline().decode('ascii') 
        cad = serialArduino.readline().decode().strip()
        #print(cad)         
        if ( cad != ''):
            ll = cad
    ll = ll.split(' ')
    lat = str(ll[0])
    log = str(ll[1]) 
    #lat = float(lat)
    #log = float(log)'''
    '''txt = open('./estatico/result.txt', 'w')
    txt.write(f'{lat}/{log}/nn/1/8')#.format(lat,log)
    txt.close()'''
    #lat = bytes(lat)
    #log = bytes(log)
    #mensaje = lat + b'/' + log + b'/nn/1/8'
    #'{0}/{1}/nn/1/8'.format(lat,log).encode()
    socket.sendto(b'10.99228/-74.80975/2021-05-31 21:37/1/8',('localhost', 37777))#.format(lat,log))
    threading.Timer(1, conectar).start()
    '''except:
        print("hubo un error, no fué posible conectar con el controlador")
    '''


        

socket = socket(AF_INET,SOCK_DGRAM)
#socket.connect(('3.132.246.245',37777))
#serialArduino = serial.Serial("/dev/ttyACM0",115200,timeout=1.0) #timeout (1 segundo) o tiempo máximo de espera para una lectura.
#time.sleep(1) # espera 1 seg, para dar tiempoa conectarse
print("conexion realizada con exito")
conectar()
threading.Timer(1.5, conectar).start()
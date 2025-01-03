from .. import mailsender #el que cree en el init
from flask import current_app, render_template
from flask_mail import Message
from smtplib import SMTPException #Viene con flask

def sendMail(to, subject, template, **kwargs):
    """
    Envía un correo electrónico usando Flask-Mail
    Args:
        to: destinatario(s) del correo. Puede ser una cadena o lista de correos
        subject: asunto del correo
        template: nombre del template a usar (sin extensión)
        **kwargs: variables adicionales para el template
    """
    print(f"Iniciando envío de correo a {to}")  # Debug inicial
    
    try:
        # Asegurar que 'to' sea una lista y validar destinatarios
        if isinstance(to, str):
            to = [to]
        if not to:
            raise ValueError("No se especificaron destinatarios")
        
        print(f"Configuración del correo - Destinatarios: {to}, Asunto: {subject}")
        
        # Verificar configuración de correo
        sender = current_app.config.get('FLASKY_MAIL_SENDER')
        if not sender:
            raise ValueError("FLASKY_MAIL_SENDER no está configurado")
        
        # Configuración del mensaje
        msg = Message(
            subject=subject,
            sender=sender,
            recipients=to
        )

        # Renderizar los templates con más información de debug
        print(f"Intentando renderizar template: {template}")
        try:
            msg.body = render_template(f'{template}.txt', **kwargs)
            msg.html = render_template(f'{template}.html', **kwargs)
            print("Templates renderizados exitosamente")
        except Exception as e:
            print(f"Error al renderizar template: {str(e)}")
            print(f"Variables disponibles: {kwargs}")
            raise ValueError(f"Error al renderizar template: {str(e)}")

        # Enviar el correo con más información de debug
        print(f"Enviando correo mediante mailsender...")
        try:
            result = mailsender.send(msg)
            print(f"Correo enviado exitosamente. Resultado: {result}")
            return True
        except Exception as e:
            print(f"Error al enviar correo via mailsender: {str(e)}")
            raise

    except SMTPException as e:
        print(f"Error SMTP detallado: {str(e)}")
        return "Error en el envío del correo: problema SMTP"
    except Exception as e:
        print(f"Error general en sendMail: {str(e)}")
        print(f"Tipo de error: {type(e)}")
        return f"Error en el envío del correo: {str(e)}"
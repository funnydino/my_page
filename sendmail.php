<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\Exception;

  require 'phpmailer/src/Exception.php';
  require 'phpmailer/src/SMTP.php';
  require 'phpmailer/src/PHPMailer.php';

  $mail = new PHPMailer(true);
  $mail->CharSet = 'UTF-8';
  $mail->setLanguage('ru', 'phpmailer/language');
  $mail->IsHTML(true);

  // Настройки SMTP
  $mail->isSMTP();
  $mail->SMTPAuth = true;
  $mail->SMTPDebug = 0;

  $mail->Host = 'ssl://smtp.timeweb.ru';
  $mail->Port = 465;
  $mail->Username = 'admin@funnydino.tmweb.ru';
  $mail->Password = 'secret';
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

  // От кого письмо:
  $mail->setFrom('admin@funnydino.tmweb.ru', 'FunnyDino');
  // Кому отправить:
  $mail->addAddress('funnydino1@gmail.com');
  // Тема письма:
  $mail->Subject = 'Новое личное сообщение';

  // Тело письма:
  $body = '<h1>Получено новое личное сообщение с сайта</h1>';

  if(trim(!empty($_POST['name']))){
    $body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
  }
  if(trim(!empty($_POST['email']))){
    $body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
  }
  if(trim(!empty($_POST['message']))){
    $body.='<p><strong>Сообщение:</strong> '.$_POST['message'].'</p>';
  }

  $mail->Body = $body;

  // Отправляем:
  if (!$mail->send()) {
    $message = 'Ошибка';
  } else {
    $message = 'Данные отправлены!';
  }

  $response = ['message' => $message];

  header('Content-type: application/json');
  echo json_encode($response);
?>

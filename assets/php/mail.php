<?php
if($_POST) {
    $name = $_POST["name"];
    $mail = $_POST["mail"];
    $subject = $_POST["subject"];
    $message = $_POST["message"];
     
    $emailTo = "marco.pagan.one@gmail.com";
    $object = $subject ." - Website form mail";
    $body = "Mail address: ".$mail ."<br> From:".$name ."<br> Message:" .$message;
    $headers  = 'MIME-Version: 1.0' . "\r\n"
    .'Content-type: text/html; charset=utf-8' . "\r\n"
    .'From: ' . $mail . "\r\n";

    $success = mail($emailTo, $object, $body, $headers);
    if ($success) { 
        header("Location: ../../contacts/mail_success.html"); 

    } else { 
        header("Location: ../../contacts/mail_error.html"); 
    }
}

?>
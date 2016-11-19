<?php
  session_start();

  ini_set("log_errors", 1);
  ini_set("error_log", "/tmp/php-error.log");
  error_log( "Hello, errors!" );

  $gid = $_POST['groupID'];
  $name = $_POST['name'];
  $email = $_POST['email'];
  $phone = $_POST['phone'];
  $gender = $_POST['gender'];
  $location = $_POST['location'];
  $year = $_POST['year'];
  echo $name;
  $new = $_POST['new'];
  echo $new;

  if($gender == "male") {
    $gender = "m";
  } else {
    $gender = "f";
  }

  $tmp = explode(" ", $name, 2);
  $fname = $tmp[0];
  $lname = $tmp[1];

  $username = "dbu319t26";
  $password = "madre7W#";
  $dbServer = "mysql.cs.iastate.edu";
  $dbName = "db319t26";

  $conn = new mysqli($dbServer, $username, $password, $dbName);
  if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  } else {
    echo "Connected successfully\n";
  }

  if(strlen($phone) == 12) {
    $temp = explode("-", $phone, 3);
    $phone = $temp[0] . $temp[1] . $temp[2];
  }

  if($new == "on") {
    $new = "Yes";
  } else {
    $new = "No";
  }

  $sql = "INSERT INTO students (firstname, lastname, email, phonenumber, 
          gender, livingarea, year, groupID) VALUES ('$fname', '$lname', 
          '$email', '$phone', '$gender', '$location', '$year', '$gid')";

  if($conn->query($sql) === TRUE) {
    echo "New record created successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }
  //exit();

  //header("Location: http://localhost:8080/www/salt/cgroupFinder.html");

  $conn->close();
?>

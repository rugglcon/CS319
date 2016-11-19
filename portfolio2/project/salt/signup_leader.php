<?php
  session_start();
  ini_set("log_errors", 1);
  ini_set("error_log", "/tmp/php-error-2.log");
  error_log("Hello, errors!");

  $name = $_POST['name'];
  $email = $_POST['email'];
  $phone = $_POST['phone'];
  $gender = $_POST['gender'];
  $location = $_POST['area'];
  $day = $_POST['day'];
  $time = $_POST['time'];
  $address = $_POST['address'];
  $co = $_POST['co-leader'];
  $latlong = $_POST['lat-long'];
  echo $name;

  $datetime = $day.' '.$time;

  $tmp = explode(" ", $name, 2);
  $fname = $tmp[0];
  $lname = $tmp[1];
  $name = $fname . $lname;

  $tmp2 = explode(" ", $co, 2);
  $fname2 = $tmp2[0];
  $lname2 = $tmp2[1];
  $co = $fname2 . $lname2;

  $tmp3 = explode(", ", $latlong, 2);
  $latitude = $tmp3[0];
  $longitude = $tmp3[1];

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

  $sql = "INSERT INTO cgroups (leader1, leader2, datetime, address,
          location, latitude, longitude) 
          VALUES ('$name', '$co', '$datetime', '$address', '$location',
          '$latitude', '$longitude')";

  if($conn->query($sql) === TRUE) {
    echo "New record created successfully";
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $conn->close();

?>

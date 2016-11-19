<?php

  session_start();
  $user = $_SESSION['user'] = $_POST['username'];
  $pass = $_POST['password'];
  
  $username = "dbu319t26";
  $password = "madre7W#";
  $dbServer = "mysql.cs.iastate.edu";
  $dbName = "db319t26";
  
  $conn = new mysqli($dbServer, $username, $password, $dbName);

  if($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
  } else {
    echo "Connected successfully<br>";
  }

  $sql = "SELECT password FROM leaders WHERE leaderID like '$user'";

  $result = mysqli_query($conn, $sql);

  if($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      $retrievedPass = $row['password'];
    }
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  if($retrievedPass == $pass) {
    header("Location: http://localhost:8080/portfolio2_group26B/project/salt/cgroupCreator.html");
  } else {
    header("Location: http://localhost:8080/portfolio2_group26B/project/salt/cgroupFinder.html");
    echo "Password or username not correct.";
  }

  $conn->close();
?> 

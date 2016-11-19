<?php

  session_start();
  //sql variables
  $username = "dbu319t26";
  $password = "madre7W#";
  $dbServer = "mysql.cs.iastate.edu"; 
  $dbName   = "db319t26";

  $sql = "SELECT * FROM cgroups";

  //make and test a connection
  $conn = new mysqli($dbServer, $username, $password, $dbName);
  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }
  $result = mysqli_query($conn, $sql);

  if($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
      //echo json_encode($row['cgroupID']).",".json_encode($row['leader1']).",".
            //json_encode($row['leader2']).",".json_encode($row['leader3']).",".
            //json_encode($row['datetime']).",".json_encode($row['address']).",".
            //json_encode($row['location']).",".json_encode($row['latitude']).",".
            //json_encode($row['longitude']);
      echo $row['cgroupID'].",".$row['leader1'].",".
            $row['leader2'].",".$row['leader3'].",".
            $row['datetime'].",".$row['address'].",".
            $row['location'].",".$row['latitude'].",".
            $row['longitude'];

      $count += 1;
      if($count < $result->num_rows) {
        echo ",";
      }
    }
  } else {
    echo "Error: " . $sql . "<br>" . $conn->error;
  }

  $conn->close();
?>

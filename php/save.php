<?php

    if(isset($_POST['trash'])){

        //get file
        $jsonString = file_get_contents('../userData/savedTrash.json');
        $data = json_decode($jsonString, true);

        //do stuff to it
        $data[$_POST['trash']]['collected'] += 1;
        $data[$_POST['trash']]['image'] = $_POST['img'];

        //send stuff back
        $newJsonString = json_encode($data);
        file_put_contents('../userData/savedTrash.json', $newJsonString);

    }else{
        echo "No trash sent";
    }

?>
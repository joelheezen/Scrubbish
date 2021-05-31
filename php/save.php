<?php

    if(isset($_GET['trash'])){

        //get file
        $jsonString = file_get_contents('../userData/savedTrash.json');
        $data = json_decode($jsonString, true);

        //do stuff to it
        $data[$_GET['trash']]['collected'] += 1;
        $data[$_GET['trash']]['image'] = $_GET['img'];

        //send stuff back
        $newJsonString = json_encode($data);
        file_put_contents('../userData/savedTrash.json', $newJsonString);
        echo "trash saved";
    }else{
        echo "No trash sent";
    }

?>
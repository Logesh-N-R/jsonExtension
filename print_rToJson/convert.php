<?php

function arrayToJson($input)
{
    $handle = fopen("php://memory", "r+");
    fwrite($handle, $input);
    rewind($handle);
    
    $evalArrayStart = '$array';
    $embeddedArray = array();
    while (($buffer = fgets($handle)) !== false) 
    {
        $buffer = trim($buffer); 
        if($buffer == 'Array')
        {
            $array = array();
        }
        $positionOfPointer = strpos($buffer, '=>');
        if($positionOfPointer !== false)
        {
            $leftPositionOfPointer = trim(substr($buffer, 0, $positionOfPointer));
            $rightPositionOfPointer = trim(substr($buffer, $positionOfPointer + strlen('=>')));
            
            $leftPositionOfPointer = str_replace(array('[', ']'), array('', ''), $leftPositionOfPointer);
            
            if($rightPositionOfPointer == 'Array')
            {
                if($leftPositionOfPointer === 0)
                {
                    $embeddedArray[] = $leftPositionOfPointer;
                }
                else
                {
                    $embeddedArray[] = "'".$leftPositionOfPointer."'";
                }
            }
            else
            {
                $evalArray = '';
                for($i = 0; $i < count($embeddedArray); $i++)
                {
                    $evalArray  .= '['.$embeddedArray[$i].']';
                }
                $rightPositionOfPointer = str_replace(array('"'), array('&quot;'), $rightPositionOfPointer);
                $evalArray = $evalArrayStart.$evalArray."['".$leftPositionOfPointer."'] = '".$rightPositionOfPointer."';";
                $evalArray = str_replace(array('&quot;'), array('"'), $evalArray);
                eval($evalArray);
            }
        }
        if($buffer == ')')
        {
            unset($embeddedArray[count($embeddedArray)-1]);
            $embeddedArray = array_values($embeddedArray);
        }
    }
    
    if (!feof($handle)) {
        echo "Error: unexpected fgets() fail\n";
    }
    fclose($handle);
    
    function replaceUnwantedCharacters(&$recursiveValue, $key)
    {
        $search = array("(", ")", "\\", "'");
        $replace = array("", "", "-", "");
        $recursiveValue = str_replace($search, $replace, $recursiveValue);
        $recursiveValue = trim(mb_convert_encoding($recursiveValue, "UTF-8"));
    }
    array_walk_recursive($array, 'replaceUnwantedCharacters');
    
    $return['phpArray'] = $array;
    $return['JSONArray'] = json_encode($array);
    return $return;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = $_POST['arrayInput'];
    $result = arrayToJson($input);
    echo json_encode($result['phpArray']);
}
?>

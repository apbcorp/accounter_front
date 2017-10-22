<?php

namespace KontragentBundle\Helper;

use KontragentBundle\Entity\Ground;

class GroundHelper
{
    /**
     * @param Ground $ground
     * @return string
     */
    public static function getGroundWithShortName(Ground $ground)
    {
        return 'Л/с ' . $ground->getAccNumber() . '(' . KontragentHelper::getShortName($ground->getKontragent()) . ')';
    }
}
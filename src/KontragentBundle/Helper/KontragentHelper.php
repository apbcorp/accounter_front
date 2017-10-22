<?php

namespace KontragentBundle\Helper;


use KontragentBundle\Entity\Kontragent;

class KontragentHelper
{
    /**
     * @param Kontragent $kontragent
     * @return string
     */
    public static function getFullName(Kontragent $kontragent)
    {
        return implode(' ', [$kontragent->getSurname(), $kontragent->getName(), $kontragent->getName2()]);
    }

    /**
     * @param Kontragent $kontragent
     * @return string
     */
    public static function getShortName(Kontragent $kontragent)
    {
        return implode(
            ' ',
            [
                $kontragent->getSurname(),
                mb_substr($kontragent->getName(), 0, 1) . '.',
                mb_substr($kontragent->getName2(), 0, 1) . '.'
            ]
        );
    }
}
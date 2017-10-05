<?php

namespace CoreBundle\Dictionary;

class ServiceTypeDictionary
{
    const KONTRAGENT_TYPE = 1;
    const GROUND_TYPE = 2;
    const FIXED_SUBTYPE = 1;
    const AREA_SYBTYPE = 2;
    const ELECTRICITY_SUBTYPE = 3;
    const GAS_SUBTYPE = 4;

    const TYPE_LANGS = [
        self::KONTRAGENT_TYPE => 'Член сообщества',
        self::GROUND_TYPE => 'Участок'
    ];
    
    const SUBTYPE_LANGS = [
        self::FIXED_SUBTYPE => 'Фиксированный',
        self::AREA_SYBTYPE => 'По площади',
        self::ELECTRICITY_SUBTYPE => 'По счетчику (электричество)',
        self::GAS_SUBTYPE => 'По счетчику (газ)'
    ];

    const SERVICE_START_DATE = '2017-10-01';
}
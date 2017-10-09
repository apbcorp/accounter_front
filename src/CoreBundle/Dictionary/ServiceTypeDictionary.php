<?php

namespace CoreBundle\Dictionary;

class ServiceTypeDictionary
{
    const KONTRAGENT_TYPE = 1;
    const GROUND_TYPE = 2;
    const FIXED_SUBTYPE = 1;
    const ALL_AREA_SYBTYPE = 2;
    const ELECTRICITY_SUBTYPE = 3;
    const WATER_SUBTYPE = 4;
    const AREA_SUBTYPE = 5;

    const TYPE_LANGS = [
        self::KONTRAGENT_TYPE => 'Член сообщества',
        self::GROUND_TYPE => 'Участок'
    ];
    
    const SUBTYPE_LANGS = [
        self::FIXED_SUBTYPE => 'Фиксированный',
        self::ALL_AREA_SYBTYPE => 'По общей площади',
        self::ELECTRICITY_SUBTYPE => 'По счетчику (электричество)',
        self::WATER_SUBTYPE => 'По счетчику (вода)',
        self::AREA_SUBTYPE => 'По занимаемой площади'
    ];

    const SERVICE_START_DATE = '2017-10-01';
}
<?php

namespace CoreBundle\Dictionary;

class MetricTypeDictionary
{
    const ELECTRICITY_TYPE = 1;
    const WATER_TYPE = 2;

    const LANGS = [
        self::ELECTRICITY_TYPE => 'Электричество',
        self::WATER_TYPE => 'Вода'
    ];
}
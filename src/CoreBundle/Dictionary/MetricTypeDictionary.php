<?php

namespace CoreBundle\Dictionary;

class MetricTypeDictionary
{
    const ELECTRICITY_TYPE = 1;
    const GAS_TYPE = 2;

    const LANGS = [
        self::ELECTRICITY_TYPE => 'Электричество',
        self::GAS_TYPE => 'Газ'
    ];
}
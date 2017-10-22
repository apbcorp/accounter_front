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

    /**
     * @param int $subtypeId
     * @return int
     */
    public static function getTypeByServiceSubtype($subtypeId)
    {
        switch ($subtypeId) {
            case ServiceTypeDictionary::ELECTRICITY_SUBTYPE:
                return self::ELECTRICITY_TYPE;
            case ServiceTypeDictionary::WATER_SUBTYPE:
                return self::WATER_TYPE;
            default:
                return 0;
        }
    }

    /**
     * @param int $type
     * @return int
     */
    public static function getServiceSubtypeByType($type)
    {
        switch ($type) {
            case self::ELECTRICITY_TYPE:
                return ServiceTypeDictionary::ELECTRICITY_SUBTYPE;
            case self::WATER_TYPE:
                return ServiceTypeDictionary::WATER_SUBTYPE;
            default:
                return 0;
        }
    }
}
<?php

namespace CoreBundle\Factory;

use CoreBundle\Struct\FilterStruct;

/**
 * Class StructFactory
 * @package CoreBundle\Factory
 */
class StructFactory
{
    /**
     * @return FilterStruct
     */
    public function getFilterStruct()
    {
        return new FilterStruct();
    }
}
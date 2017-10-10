<?php

namespace CoreBundle\BaseClasses\Interfaces;

interface SupplyRepositoryInterface
{
    const MAX_RESULT = 50;
    
    /**
     * @param string $searchString
     * @param int    $unitId
     * @return array
     */
    public function search($searchString, $unitId);
}
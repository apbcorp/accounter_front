<?php

namespace CoreBundle\BaseClasses\Interfaces;

interface SupplyRepositoryInterface
{
    /**
     * @param string $searchString
     * @param int    $unitId
     * @return array
     */
    public function search($searchString, $unitId);
}
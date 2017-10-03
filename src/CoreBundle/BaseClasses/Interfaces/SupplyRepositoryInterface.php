<?php

namespace CoreBundle\BaseClasses\Interfaces;

interface SupplyRepositoryInterface
{
    /**
     * @param $searchString
     * @return array
     */
    public function search($searchString);
}
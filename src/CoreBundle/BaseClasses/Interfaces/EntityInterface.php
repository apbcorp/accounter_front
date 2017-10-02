<?php

namespace CoreBundle\BaseClasses\Interfaces;

interface EntityInterface
{
    /**
     * @return int
     */
    public function getId();

    /**
     * @param bool $deleted
     * @return $this
     */
    public function setIsDeleted($deleted);

    /**
     * @return bool
     */
    public function isDeleted();
}
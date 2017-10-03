<?php

namespace CoreBundle\BaseClasses\Interfaces;

interface DocumentEntityInterface extends EntityInterface
{
    /**
     * @return \DateTime
     */
    public function getCreated();

    /**
     * @param \DateTime $date
     * @return $this
     */
    public function setCreated(\DateTime $date);

    /**
     * @return \DateTime
     */
    public function getUpdated();

    /**
     * @param \DateTime $date
     * @return $this
     */
    public function setUpdated(\DateTime $date);
}
<?php

namespace KontragentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Meter
 *
 * @ORM\Table(name="meter")
 * @ORM\Entity(repositoryClass="KontragentBundle\Repository\MeterRepository")
 */
class Meter implements EntityInterface
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="number", type="string", length=255)
     */
    private $number;

    /**
     * @var int
     *
     * @ORM\Column(name="type", type="integer")
     */
    private $type;

    /**
     * @var Ground
     *
     * @ORM\ManyToOne(targetEntity="Ground")
     * @ORM\JoinColumn(name="ground_id", referencedColumnName="id")
     */
    private $ground;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    private $deleted;

    /**
     * @var int
     *
     * @ORM\Column(name="unit_id", type="integer")
     */
    private $unitId;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * @param string $number
     * @return $this
     */
    public function setNumber($number)
    {
        $this->number = $number;

        return $this;
    }

    /**
     * @return int
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param int $type
     * @return $this
     */
    public function setType($type)
    {
        $this->type = $type;

        return $this;
    }

    /**
     * @return Ground
     */
    public function getGround()
    {
        return $this->ground;
    }

    /**
     * @param Ground $ground
     * @return $this
     */
    public function setGround(Ground $ground)
    {
        $this->ground = $ground;

        return $this;
    }

    /**
     * @return bool
     */
    public function isDeleted()
    {
        return $this->deleted;
    }

    /**
     * @param bool $deleted
     * @return $this
     */
    public function setIsDeleted($deleted)
    {
        $this->deleted = $deleted;

        return $this;
    }

    /**
     * @return int
     */
    public function getUnitId()
    {
        return $this->unitId;
    }

    /**
     * @param int $unitId
     * @return $this
     */
    public function setUnitId($unitId)
    {
        $this->unitId = $unitId;

        return $this;
    }
}
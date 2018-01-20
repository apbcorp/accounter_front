<?php

namespace KontragentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Ground
 *
 * @ORM\Table(name="ground_parts")
 * @ORM\Entity(repositoryClass="KontragentBundle\Repository\GroundPartsRepository")
 */
class GroundParts implements EntityInterface
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
     * @Assert\NotBlank()
     * @ORM\Column(name="number", type="string", length=255)
     */
    private $number;

    /**
     * @var string
     *
     * @Assert\NotBlank()
     * @ORM\Column(name="line", type="string", length=255)
     */
    private $line;

    /**
     * @var string
     *
     * @Assert\NotBlank()
     * @ORM\Column(name="ground_number", type="string", length=255)
     */
    private $groundNumber;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    private $deleted;

    /**
     * @var Ground
     *
     * @ORM\ManyToOne(targetEntity="Ground", inversedBy="$groundParts")
     * @ORM\JoinColumn(name="ground_id", referencedColumnName="id")
     */
    private $ground;

    /**
     * @var integer
     *
     * @ORM\Column(name="ground_id", type="integer")
     */
    private $groundId;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
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
     * @return string
     */
    public function getLine()
    {
        return $this->line;
    }

    /**
     * @param string $line
     * @return $this
     */
    public function setLine($line)
    {
        $this->line = $line;

        return $this;
    }

    /**
     * @return string
     */
    public function getGroundNumber()
    {
        return $this->groundNumber;
    }

    /**
     * @param string $groundNumber
     * @return $this
     */
    public function setGroundNumber($groundNumber)
    {
        $this->groundNumber = $groundNumber;

        return $this;
    }
}
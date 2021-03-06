<?php

namespace KontragentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use KontragentBundle\Entity\GroundParts;

/**
 * Ground
 *
 * @ORM\Table(name="ground")
 * @ORM\Entity(repositoryClass="KontragentBundle\Repository\GroundRepository")
 */
class Ground implements EntityInterface
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
     * @ORM\Column(name="acc_number", type="string", length=255)
     */
    private $accNumber;

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
     * @var float
     *
     * @ORM\Column(name="area", type="decimal", precision=7, scale=3)
     */
    private $area;

    /**
     * @var float
     *
     * @ORM\Column(name="free_area", type="decimal", precision=7, scale=3)
     */
    private $freeArea;

    /**
     * @var float
     *
     * @ORM\Column(name="common_area", type="decimal", precision=7, scale=3)
     */
    private $commonArea;

    /**
     * @var float
     *
     * @ORM\Column(name="all_area", type="decimal", precision=7, scale=3)
     */
    private $allArea;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    private $deleted;

    /**
     * @var Kontragent
     *
     * @ORM\ManyToOne(targetEntity="Kontragent", inversedBy="grounds")
     * @ORM\JoinColumn(name="kontragent_id", referencedColumnName="id")
     */
    private $kontragent;

    /**
     * @var integer
     *
     * @ORM\Column(name="kontragent_id", type="integer")
     */
    private $kontragentId;

    /**
     * @var int
     *
     * @ORM\Column(name="unit_id", type="integer")
     */
    private $unitId;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="GroundParts", mappedBy="ground")
     */
    private $groundParts;

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return int
     */
    public function getAccNumber()
    {
        return $this->accNumber;
    }

    /**
     * @param int $number
     * @return $this
     */
    public function setAccNumber($number)
    {
        $this->accNumber = $number;

        return $this;
    }

    /**
     * @return int
     */
    public function getNumber()
    {
        return $this->number;
    }

    /**
     * @param int $number
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
    public function getLine()
    {
        return $this->line;
    }

    /**
     * @param int $line
     * @return $this
     */
    public function setLine($line)
    {
        $this->line = $line;

        return $this;
    }

    /**
     * @return int
     */
    public function getGroundNumber()
    {
        return $this->groundNumber;
    }

    /**
     * @param int $number
     * @return $this
     */
    public function setGroundNumber($number)
    {
        $this->groundNumber = $number;

        return $this;
    }

    /**
     * @return float
     */
    public function getArea()
    {
        return $this->area;
    }

    /**
     * @param float $area
     * @return $this
     */
    public function setArea($area)
    {
        $this->area = $this->toFloat($area);

        return $this;
    }

    /**
     * @return float
     */
    public function getFreeArea()
    {
        return $this->freeArea;
    }

    /**
     * @param float $area
     * @return $this
     */
    public function setFreeArea($area)
    {
        $this->freeArea = $this->toFloat($area);

        return $this;
    }

    /**
     * @return float
     */
    public function getCommonArea()
    {
        return $this->commonArea;
    }

    /**
     * @param float $area
     * @return $this
     */
    public function setCommonArea($area)
    {
        $this->commonArea = $this->toFloat($area);

        return $this;
    }

    /**
     * @return float
     */
    public function getAllArea()
    {
        return $this->allArea;
    }

    /**
     * @param float $area
     * @return $this
     */
    public function setAllArea($area)
    {
        $this->allArea = $this->toFloat($area);

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
     * @return Kontragent
     */
    public function getKontragent()
    {
        return $this->kontragent;
    }

    public function setKontragent(Kontragent $kontragent)
    {
        $this->kontragent = $kontragent;

        return $this;
    }

    /**
     * @param string $value
     * @return string
     */
    private function toFloat($value)
    {
        return str_replace(',', '.', $value);
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

    /**
     * @return ArrayCollection
     */
    public function getGroundParts()
    {
        return $this->groundParts;
    }

    /**
     * @param \KontragentBundle\Entity\GroundParts $part
     * @return $this
     */
    public function addGroundParts(GroundParts $part)
    {
        $this->groundParts->add($part);

        return $this;
    }
}
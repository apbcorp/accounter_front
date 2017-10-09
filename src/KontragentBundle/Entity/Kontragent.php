<?php

namespace KontragentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * Kontragent
 *
 * @ORM\Table(name="kontragent")
 * @ORM\Entity(repositoryClass="KontragentBundle\Repository\KontragentRepository")
 */
class Kontragent implements EntityInterface
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
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @Assert\NotBlank()
     * @ORM\Column(name="surname", type="string", length=255)
     */
    private $surname;

    /**
     * @var string
     *
     * @Assert\NotBlank()
     * @ORM\Column(name="name2", type="string", length=255)
     */
    private $name2;

    /**
     * @var string
     *
     * @Assert\NotBlank()
     * @Assert\Regex("/\+380........./")
     * @ORM\Column(name="phone", type="string", length=13)
     */
    private $phone;

    /**
     * @var string
     *
     * @Assert\NotBlank()
     * @ORM\Column(name="adress", type="string", length=255)
     */
    private $adress;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    private $deleted;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="Ground", mappedBy="kontragent")
     */
    private $grounds;

    /**
     * @var int
     *
     * @ORM\Column(name="unit_id", type="integer")
     */
    private $unitId;

    /**
     * Kontragent constructor.
     */
    public function __construct()
    {
        $this->grounds = new ArrayCollection();
    }

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
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return $this
     */
    public function setName($name)
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getSurname()
    {
        return $this->surname;
    }

    /**
     * @param string $surname
     * @return $this
     */
    public function setSurname($surname)
    {
        $this->surname = $surname;

        return $this;
    }

    /**
     * @return string
     */
    public function getName2()
    {
        return $this->name2;
    }

    /**
     * @param string $name
     * @return $this
     */
    public function setName2($name)
    {
        $this->name2 = $name;

        return $this;
    }

    /**
     * @return string
     */
    public function getPhone()
    {
        return $this->phone;
    }

    /**
     * @param string $phone
     * @return $this
     */
    public function setPhone($phone)
    {
        $this->phone = $phone;

        return $this;
    }

    /**
     * @return string
     */
    public function getAdress()
    {
        return $this->adress;
    }

    /**
     * @param string $adress
     * @return $this
     */
    public function setAdress($adress)
    {
        $this->adress = $adress;

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
     * @return ArrayCollection
     */
    public function getGrounds()
    {
        return $this->grounds;
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
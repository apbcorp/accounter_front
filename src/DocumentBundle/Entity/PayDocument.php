<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\DocumentEntityInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Kontragent;

/**
 * PayDocument
 *
 * @ORM\Table(name="document_pay")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\PayDocumentRepository")
 */
class PayDocument implements DocumentEntityInterface
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="created", type="datetime")
     */
    protected $created;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated", type="datetime")
     */
    protected $updated;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="PayRow", mappedBy="document")
     */
    private $rows;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    protected $deleted;


    /**
     * @var Kontragent
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Kontragent")
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
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * TarifDocument constructor.
     */
    public function __construct()
    {
        $this->rows = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return \DateTime
     */
    public function getCreated()
    {
        return $this->created;
    }

    /**
     * @param \DateTime $date
     * @return $this
     */
    public function setCreated(\DateTime $date)
    {
        $this->created = $date;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getUpdated()
    {
        return $this->updated;
    }

    /**
     * @param \DateTime $date
     * @return $this
     */
    public function setUpdated(\DateTime $date)
    {
        $this->updated = $date;

        return $this;
    }

    /**
     * @return ArrayCollection
     */
    public function getRows()
    {
        return $this->rows;
    }

    /**
     * @param PayRow $row
     * @return $this
     */
    public function addRow(PayRow $row)
    {
        $this->rows->add($row);

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

    /**
     * @param Kontragent $kontragent
     * @return $this
     */
    public function setKontragent(Kontragent $kontragent)
    {
        $this->kontragent = $kontragent;

        return $this;
    }

    /**
     * @return \DateTime
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * @param \DateTime $dateTime
     * @return $this
     */
    public function setDate(\DateTime $dateTime)
    {
        $this->date = $dateTime;

        return $this;
    }
}
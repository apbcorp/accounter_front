<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\Interfaces\DocumentEntityInterface;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Kontragent;

/**
 * AccurringDocument
 *
 * @ORM\Table(name="document_accurring")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\AccurringDocumentRepository")
 */
class AccurringDocument implements DocumentEntityInterface
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
     * @var \DateTime
     *
     * @ORM\Column(name="created", type="datetime")
     */
    private $created;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="updated", type="datetime")
     */
    private $updated;

    /**
     * @var ArrayCollection
     *
     * @ORM\OneToMany(targetEntity="AccurringRow", mappedBy="document")
     */
    private $rows;

    /**
     * @var bool
     *
     * @ORM\Column(name="deleted", type="integer")
     */
    private $deleted;

    /**
     * @var Kontragent
     *
     * @ORM\ManyToOne(targetEntity="\KontragentBundle\Entity\Kontragent")
     * @ORM\JoinColumn(name="kontragent_id", referencedColumnName="id")
     */
    private $kontragent;

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
     * @param AccurringRow $row
     * @return $this
     */
    public function addRow(AccurringRow $row)
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
}
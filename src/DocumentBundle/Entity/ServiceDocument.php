<?php

namespace DocumentBundle\Entity;

use CoreBundle\BaseClasses\DocumentEntityAbstract;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;
use KontragentBundle\Entity\Kontragent;
use Symfony\Component\Validator\Constraints\DateTime;

/**
 * ServiceDocument
 *
 * @ORM\Table(name="document_service")
 * @ORM\Entity(repositoryClass="DocumentBundle\Repository\ServiceDocumentRepository")
 */
class ServiceDocument extends DocumentEntityAbstract
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
     * @ORM\OneToMany(targetEntity="ServiceRow", mappedBy="document")
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
     * @var int
     *
     * @ORM\Column(name="unit_id", type="integer")
     */
    private $unitId;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="date", type="datetime")
     */
    private $date;

    /**
     * ServiceDocument constructor.
     */
    public function __construct()
    {
        $this->rows = new ArrayCollection();
    }

    /**
     * @return ArrayCollection
     */
    public function getRows()
    {
        return $this->rows;
    }

    /**
     * @param ServiceRow $row
     * @return $this
     */
    public function addRow(ServiceRow $row)
    {
        $this->rows->add($row);

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

    /**
     * @return Kontragent
     */
    public function getKontragent()
    {
        return $this->kontragent;
    }

    /**
     * @param Kontragent $kontragent
     * @return Kontragent
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
     * @param \DateTime $date
     * @return $this
     */
    public function setDate(\DateTime $date)
    {
        $this->date = $date;

        return $this;
    }
}
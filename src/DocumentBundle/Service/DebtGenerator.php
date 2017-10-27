<?php

namespace DocumentBundle\Service;

use CoreBundle\Dictionary\ServiceTypeDictionary;
use Doctrine\ORM\EntityManager;
use DocumentBundle\Entity\MeterServiceDocument;
use DocumentBundle\Entity\PayDocument;
use DocumentBundle\Entity\ServiceDocument;
use DocumentBundle\Repository\MeterServiceDocumentRepository;
use DocumentBundle\Repository\PayDocumentRepository;
use DocumentBundle\Repository\ServiceDocumentRepository;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Service;

class DebtGenerator
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var MeterServiceDocumentRepository
     */
    private $meterServiceRepo;

    /**
     * @var ServiceDocumentRepository
     */
    private $serviceRepo;

    /**
     * @var PayDocumentRepository
     */
    private $payRepo;

    /**
     * DebtGenerator constructor.
     * @param EntityManager $em
     */
    public function __construct(EntityManager $em)
    {
        $this->em = $em;
        $this->meterServiceRepo = $em->getRepository(MeterServiceDocument::class);
        $this->serviceRepo = $em->getRepository(ServiceDocument::class);
        $this->payRepo = $em->getRepository(PayDocument::class);
    }

    /**
     * @param \DateTime  $date
     * @param Kontragent $kontragent
     * @return array
     */
    public function getDebtByKontragent(\DateTime $date, Kontragent $kontragent)
    {
        /** @var Service[] $services */
        $services = $this->em->getRepository(Service::class)->findBy(['deleted' => false]);
        /** @var Ground[] $grounds */
        $grounds = $this->em->getRepository(Ground::class)->findBy(['deleted' => false, 'kontragent' => $kontragent]);
        
        $result = [];
        foreach ($services as $service) {
            if ($service->getType() == ServiceTypeDictionary::KONTRAGENT_TYPE) {
                $result[] = [
                    'ground' => null,
                    'groundId' => null,
                    'service' => $service->getName(),
                    'serviceId' => $service->getId(),
                    'dolg' => $this->getDebtByServiceAndKontragent($date, $kontragent, $service)
                ];
            } else {
                foreach ($grounds as $ground) {
                    $result[] = [
                        'ground' => $ground->getAccNumber(),
                        'groundId' => $ground->getId(),
                        'service' => $service->getName(),
                        'serviceId' => $service->getId(),
                        'dolg' => $this->getDebtByServiceAndGround($date, $kontragent, $ground, $service)
                    ];
                }
            }
        }

        return $result;
    }

    /**
     * @param \DateTime  $date
     * @param Kontragent $kontragent
     * @param Service    $service
     * @return float
     */
    public function getDebtByServiceAndKontragent(\DateTime $date, Kontragent $kontragent, Service $service)
    {
        return $this->serviceRepo->getDebt($date, $kontragent, null, $service) - $this->payRepo->getDebt($date, $kontragent, null, $service);
    }

    /**
     * @param \DateTime  $date
     * @param Kontragent $kontragent
     * @param Ground     $ground
     * @param Service    $service
     * @return float
     */
    public function getDebtByServiceAndGround(\DateTime $date, Kontragent $kontragent, Ground $ground, Service $service)
    {
        $debt = $service->getSubType() == ServiceTypeDictionary::ELECTRICITY_SUBTYPE || $service->getSubType() == ServiceTypeDictionary::WATER_SUBTYPE
            ? $this->meterServiceRepo->getDebt($date, $ground, $service)
            : $this->serviceRepo->getDebt($date, $kontragent, $ground, $service);

        return $debt - $this->payRepo->getDebt($date, $kontragent, $ground, $service);
    }
}
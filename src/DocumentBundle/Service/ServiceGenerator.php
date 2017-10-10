<?php

namespace DocumentBundle\Service;

use CoreBundle\Dictionary\MetricTypeDictionary;
use CoreBundle\Dictionary\ServiceTypeDictionary;
use Doctrine\ORM\EntityManager;
use DocumentBundle\Entity\AccurringRow;
use DocumentBundle\Entity\MeterRow;
use DocumentBundle\Entity\TarifRow;
use DocumentBundle\Repository\AccurringRowRepository;
use DocumentBundle\Repository\MeterRowRepository;
use DocumentBundle\Repository\TarifRowRepository;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Meter;
use KontragentBundle\Entity\Service;

class ServiceGenerator
{
    /**
     * @var EntityManager
     */
    private $entityManager;
    
    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param int       $kontragentId
     * @param int       $serviceId
     * @param \DateTime $date
     * @return array
     */
    public function generateByServiceId($kontragentId, $serviceId, \DateTime $date)
    {
        /** @var Service $service */
        $service = $this->entityManager->getRepository(Service::class)->find($serviceId);
        /** @var Kontragent $kontragent */
        $kontragent = $this->entityManager->getRepository(Kontragent::class)->find($kontragentId);

        if (!$service) {
            return [];
        }

        $result = [
            'serviceId' => $serviceId,
            'kontragentId' => $kontragentId,
            'date' => $date->format('Y-m-d')
        ];

        /** @var TarifRowRepository $repository */
        $repository = $this->entityManager->getRepository(TarifRow::class);
        $result['price'] = $repository->getPrice($service, $date);

        $base = $this->getBase($service, $kontragent, $date);
        $usedBase = $this->entityManager->getRepository(AccurringRow::class)->getValueForPeriod($service, $kontragent, $date);
        $result['base'] = ($base - $usedBase) > 0 ? $base - $usedBase : 0;

        return $result;
    }

    /**
     * @param Service    $service
     * @param Kontragent $kontragent
     * @param \DateTime  $date
     * @return float|int
     */
    private function getBase(Service $service, Kontragent $kontragent, \DateTime $date)
    {
        if ($service->getType() == ServiceTypeDictionary::KONTRAGENT_TYPE) {
            return 1;
        } else {
            switch ($service->getSubType()) {
                case ServiceTypeDictionary::FIXED_SUBTYPE:
                    return 1;
                case ServiceTypeDictionary::ALL_AREA_SYBTYPE:
                    $result = 0;
                    /** @var Ground $ground */
                    foreach ($kontragent->getGrounds() as $ground) {
                        $result += $ground->getAllArea();
                    }
                    return $result;
                case ServiceTypeDictionary::AREA_SUBTYPE:
                    $result = 0;
                    /** @var Ground $ground */
                    foreach ($kontragent->getGrounds() as $ground) {
                        $result += $ground->getArea();
                    }
                    return $result;
                case ServiceTypeDictionary::ELECTRICITY_SUBTYPE:
                    return $this->getMeterValue($kontragent, $date, MetricTypeDictionary::ELECTRICITY_TYPE);
                case ServiceTypeDictionary::WATER_SUBTYPE:
                    return $this->getMeterValue($kontragent, $date, MetricTypeDictionary::ELECTRICITY_TYPE);
            }
        }
    }

    /**
     * @param Kontragent $kontragent
     * @param \DateTime  $date
     * @param int        $type
     * @return float
     */
    private function getMeterValue(Kontragent $kontragent, \DateTime $date, $type)
    {
        $result = 0;

        $meters = [];
        foreach ($kontragent->getGrounds() as $ground) {
            $meters = array_merge($meters, $this->entityManager->getRepository(Meter::class)->findBy(['ground' => $ground, 'deleted' => false, 'type' => $type]));
        }

        if (!$meters) {
            return $result;
        }

        /** @var MeterRowRepository $repository */
        $repository = $this->entityManager->getRepository(MeterRow::class);
        foreach ($meters as $meter) {
            $dateStart = $date->modify('first day');
            $dateEnd = $date->modify('last day');
            $value = $repository->getValueByDate($meter, $dateStart, $dateEnd);

            $result += $value;
        }

        return $result;
    }
}
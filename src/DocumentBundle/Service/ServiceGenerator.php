<?php

namespace DocumentBundle\Service;

use CoreBundle\Dictionary\MetricTypeDictionary;
use CoreBundle\Dictionary\ServiceTypeDictionary;
use Doctrine\ORM\EntityManager;
use DocumentBundle\Entity\AccurringRow;
use DocumentBundle\Entity\MeterRow;
use DocumentBundle\Entity\ServiceRow;
use DocumentBundle\Entity\TarifRow;
use DocumentBundle\Repository\AccurringRowRepository;
use DocumentBundle\Repository\MeterRowRepository;
use DocumentBundle\Repository\ServiceRowRepository;
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

    /**
     * ServiceGenerator constructor.
     * @param EntityManager $entityManager
     */
    public function __construct(EntityManager $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @param \DateTime $date
     * @param int       $kontragentId
     * @return array
     */
    public function generateByKontragent(\DateTime $date, $kontragentId)
    {
        /** @var Kontragent $kontragent */
        $kontragent = $this->entityManager->getRepository(Kontragent::class)->find($kontragentId);

        $grounds = $this->entityManager->getRepository(Ground::class)->findBy(['deleted' => false, 'kontragent' => $kontragent]);

        $result = [];
        foreach ($grounds as $ground) {
            $requestResult = $this->generateByGroundId($date, $ground->getId());
            $result = array_merge($result, $requestResult);
        }

        return $result;
    }

    /**
     * @param \DateTime $date
     * @param int       $groundId
     * @return array
     */
    public function generateByGroundId(\DateTime $date, $groundId)
    {
        $services = $this->entityManager->getRepository(Service::class)->findBy([
            'deleted' => false
        ]);

        $servicesList = [];
        /** @var Service $service */
        foreach ($services as $service) {
            if ($service->getSubType() != ServiceTypeDictionary::WATER_SUBTYPE && $service->getSubType() != ServiceTypeDictionary::ELECTRICITY_SUBTYPE) {
                $servicesList[] = $service;
            }
        }

        $result = [];
        foreach ($servicesList as $service) {
            $result[] = $this->generateByService($date, $groundId, $service);
        }

        return $result;
    }

    /**
     * @param \DateTime $date
     * @param int       $groundId
     * @param Service   $service
     * @return array
     */
    public function generateByService(\DateTime $date, $groundId, Service $service)
    {
        /** @var Ground $ground */
        $ground = $this->entityManager->getRepository(Ground::class)->find($groundId);
        /** @var TarifRowRepository $tarifRepo */
        $tarifRepo = $this->entityManager->getRepository(TarifRow::class);

        $result = [
            'serviceId' => $service->getId(),
            'service' => $service->getName(),
            'groundId' => $service->getType() == ServiceTypeDictionary::KONTRAGENT_TYPE ? null : $groundId,
            'date' => $date,
            'price' => $tarifRepo->getPrice($service, $date),
            'count' => $this->getCount($service, $ground, $date)
        ];
        $result['sum'] = $result['count'] * $result['price'];

        return $result;
    }

    /**
     * @param Service   $service
     * @param Ground    $ground
     * @param \DateTime $date
     * @return float
     */
    private function getCount(Service $service, Ground $ground, \DateTime $date)
    {
        $defaultCount = $this->getDefaultCount($service, $ground);
        /** @var ServiceRowRepository $serviceRowRepo */
        $serviceRowRepo = $this->entityManager->getRepository(ServiceRow::class);
        $strDate = strtotime($date->format('Y-m-d'));

        switch ($service->getPeriodType()) {
            case ServiceTypeDictionary::MONTH__PERIOD_TYPE:
                $startDate = new \DateTime(date('Y-m-1', $strDate));
                $endDate = new \DateTime(date('Y-m-t', $strDate));

                break;
            case ServiceTypeDictionary::YEAR__PERIOD_TYPE:
                $startDate = new \DateTime(date('Y-1-1', $strDate));
                $endDate = new \DateTime(date('Y-12-31', $strDate));

                break;
            default:
                $startDate = new \DateTime(date('1990-1-1', $strDate));
                $endDate = new \DateTime(date('1990-1-1', $strDate));

                break;
        }

        $usedCount = $serviceRowRepo->getCountByPeriod(
            $service,
            $ground,
            $startDate,
            $endDate
        );

        return $defaultCount > $usedCount ? $defaultCount - $usedCount : 0;
    }

    /**
     * @param Service $service
     * @param Ground  $ground
     * @return float
     */
    private function getDefaultCount(Service $service, Ground $ground)
    {
        switch ($service->getType()) {
            case ServiceTypeDictionary::KONTRAGENT_TYPE:
                return 1;
            case ServiceTypeDictionary::GROUND_TYPE:
                return $this->getDefaultSubtypeCount($service->getSubType(), $ground);
            default:
                return 0;
        }
    }

    /**
     * @param int    $subtype
     * @param Ground $ground
     * @return float
     */
    private function getDefaultSubtypeCount($subtype, Ground $ground)
    {
        switch ($subtype) {
            case ServiceTypeDictionary::FIXED_SUBTYPE:
                return 1;
            case ServiceTypeDictionary::ALL_AREA_SYBTYPE:
                return $ground->getAllArea();
            case ServiceTypeDictionary::AREA_SUBTYPE:
                return $ground->getArea();
            default:
                return 0;
        }
    }
}
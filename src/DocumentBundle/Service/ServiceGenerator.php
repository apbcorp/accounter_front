<?php

namespace DocumentBundle\Service;

use CoreBundle\Dictionary\MetricTypeDictionary;
use CoreBundle\Dictionary\ServiceTypeDictionary;
use Doctrine\ORM\EntityManager;
use DocumentBundle\Entity\AccurringRow;
use DocumentBundle\Entity\MeterRow;
use DocumentBundle\Entity\TarifRow;
use DocumentBundle\Repository\AccurringRowRepository;
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
     * @param $kontragentId
     * @return array
     */
    public function getServicesByKontragent($kontragentId)
    {
        /** @var Kontragent $kontragent */
        $kontragent = $this->entityManager->getRepository(Kontragent::class)->find($kontragentId);

        if (!$kontragent) {
            return [];
        }

        $result = $this->generateKontragetTypeServices($kontragent);

        foreach ($kontragent->getGrounds() as $ground) {
            $result = array_merge($result, $this->generateGroundTypeServices($ground));
        }

        return $result;
    }

    /**
     * @param Ground $ground
     * @return array
     */
    public function generateGroundTypeServices(Ground $ground)
    {
        $services = $this->entityManager->getRepository(Service::class)->findBy([
            'deleted' => false,
            'type' => ServiceTypeDictionary::GROUND_TYPE
        ]);

        if (!$services) {
            return [];
        }

        /** @var TarifRowRepository $tarifRowRepository */
        $tarifRowRepository = $this->entityManager->getRepository(TarifRow::class);
        /** @var AccurringRowRepository $accurringRowRepository */
        $accurringRowRepository = $this->entityManager->getRepository(AccurringRow::class);

        $result = [];
        /** @var Service $service */
        foreach ($services as $service) {
            $nowDate = new \DateTime();
            $startDateTime = new \DateTime(ServiceTypeDictionary::SERVICE_START_DATE);
            $interval = new \DateInterval('P1M');

            for ($date = $startDateTime; $date <= $nowDate; $date->add($interval)) {
                $records = $accurringRowRepository->findBy(['service' => $service, 'period' => $date]);
                $data = $this->getDataByGroundAndSubtype($ground, $service->getSubType(), $date);

                if (!$records) {
                    $price = $tarifRowRepository->getPrice($service, $date);

                    $result[] = $this->generateRow($service, $date, $price, $data);
                } else {
                    $count = 0;

                    /** @var AccurringRow $record */
                    foreach ($records as $record) {
                        $count += $record->getCalcBase();
                    }

                    $base = $data;
                    $base -= $count;

                    if ($base > 0) {
                        $data = [
                            'data' => $base,
                            'endValue' => $data,
                            'startValue' => $data - $base
                        ];

                        $price = $tarifRowRepository->getPrice($service, $date);
                        $result[] = $this->generateRow($service, $date, $price, $data);
                    }
                }
            }
        }

        return $result;
    }

    /**
     * @param Kontragent $kontragent
     * @return array
     */
    public function generateKontragetTypeServices(Kontragent $kontragent)
    {
        $services = $this->entityManager->getRepository(Service::class)->findBy([
            'deleted' => false,
            'type' => ServiceTypeDictionary::KONTRAGENT_TYPE
        ]);

        if (!$services) {
            return [];
        }

        /** @var TarifRowRepository $tarifRowRepository */
        $tarifRowRepository = $this->entityManager->getRepository(TarifRow::class);
        /** @var AccurringRowRepository $accurringRowRepository */
        $accurringRowRepository = $this->entityManager->getRepository(AccurringRow::class);

        $result = [];
        /** @var Service $service */
        foreach ($services as $service) {
            $nowDate = new \DateTime();
            $startDateTime = new \DateTime(ServiceTypeDictionary::SERVICE_START_DATE);
            $interval = new \DateInterval('P1M');

            for ($date = $startDateTime; $date <= $nowDate; $date->add($interval)) {
                if (!$accurringRowRepository->findOneBy(['service' => $service, 'period' => $date])) {
                    $price = $tarifRowRepository->getPrice($service, $date);
                    $data = $this->getDataByKontragentAndSubtype($kontragent, $service->getSubType());

                    $result[] = $this->generateRow($service, $date, $price, $data);
                }
            }
        }

        return $result;
    }

    /**
     * @param Service   $service
     * @param \DateTime $period
     * @param float     $price
     * @param float     $data
     * @return array
     */
    private function generateRow(Service $service, \DateTime $period, $price, $data)
    {
        $komment = $service->getName() . ' за ' . $period->format('m-Y');

        if (is_array($data)) {
            $komment .= ', показания счетчика ' . $data['startValue'] . '-' . $data['endValue'];
            $data = $data['data'];
        }

        return [
            'service' => $service->getName(),
            'serviceId' => $service->getId(),
            'period' => $period->format('Y-m-d'),
            'calcBase' => $data,
            'price' => $price,
            'sum' => $data * $price,
            'komment' => $komment
        ];
    }

    /**
     * @param Kontragent $kontragent
     * @param int        $subtype
     * @return int
     */
    private function getDataByKontragentAndSubtype(Kontragent $kontragent, $subtype)
    {
        switch ($subtype) {
            case ServiceTypeDictionary::FIXED_SUBTYPE:
                return 1;
        }

        return 0;
    }
    
    private function getDataByGroundAndSubtype(Ground $ground, $subtype, \DateTime $date)
    {
        switch ($subtype) {
            case ServiceTypeDictionary::FIXED_SUBTYPE:
                return 1;
            case ServiceTypeDictionary::ALL_AREA_SYBTYPE:
                return $ground->getAllArea();
            case ServiceTypeDictionary::ELECTRICITY_SUBTYPE:
                return $this->getMeterValue($ground, $date, MetricTypeDictionary::ELECTRICITY_TYPE);
            case ServiceTypeDictionary::WATER_SUBTYPE:
                return $this->getMeterValue($ground, $date, MetricTypeDictionary::WATER_TYPE);
        }

        return 0;
    }

    /**
     * @param Ground    $ground
     * @param \DateTime $date
     * @param int       $type
     * @return float
     */
    private function getMeterValue(Ground $ground, \DateTime $date, $type)
    {
        $result = 0;

        $meters = $this->entityManager->getRepository(Meter::class)->findBy(['ground' => $ground, 'deleted' => false, 'type' => $type]);

        if (!$meters) {
            return $result;
        }

        $repository = $this->entityManager->getRepository(MeterRow::class);
        foreach ($meters as $meter) {
            $value = $repository->getEndValueByDate($meter, $date);

            $result += $value;
        }

        return $result;
    }
}
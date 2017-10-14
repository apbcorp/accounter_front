<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use DocumentBundle\Entity\AccurringDocument;
use DocumentBundle\Entity\AccurringRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Service;

class AccurringDocumentFormatter extends EntityFormatterAbstract
{
    protected $entityClass = AccurringDocument::class;

    /**
     * @param AccurringDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        $rows = [];

        /** @var AccurringRow $row */
        foreach ($entity->getRows() as $row) {
            if ($row->isDeleted()) {
                continue;
            }

            $rows[] = [
                'id' => $row->getId(),
                'serviceId' => $row->getService()->getId(),
                'service' => $row->getService()->getName(),
                'price' => $row->getPrice(),
                'calcBase' => $row->getCalcBase(),
                'period' => $row->getPeriod()->format('Y-m-d'),
                'sum' => $row->getSum(),
                'komment' => $row->getKomment()
            ];
        }

        return [
            'id' => $entity->getId(),
            'date' => $entity->getDate()->format('Y-m-d'),
            'groundId' => $entity->getGround()->getId(),
            'ground' => 'Л/с ' . $entity->getGround()->getAccNumber() . ' (' . implode(' ', [
                $entity->getGround()->getKontragent()->getSurname(),
                $entity->getGround()->getKontragent()->getName(),
                $entity->getGround()->getKontragent()->getName2()
            ]),
            'rows' => $rows
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|bool
     */
    public function setData($id, array $data)
    {
        /** @var AccurringDocument $entity */
        $entity = $this->getEntity($id, 'createAccurringDocument');

        if (!$entity) {
            return false;
        }

        $ids = [];
        foreach ($data['rows'] as $row) {
            if ($row['id']) {
                $subEntity = $this->entityManager->getRepository(AccurringRow::class)->find($row['id']);
            } else {
                $subEntity = $this->entityFactory->createAccurringRow();
                $subEntity->setCreated(new \DateTime());
                $subEntity->setIsDeleted(false);

                $this->entityManager->persist($subEntity);
            }

            $service = $this->entityManager->getReference(Service::class, $row['serviceId']);

            $subEntity->setService($service);
            $subEntity->setUpdated(new \DateTime());
            $subEntity->setPrice($row['price']);
            $subEntity->setDocument($entity);
            $subEntity->setPeriod(new \DateTime($row['period']));
            $subEntity->setCalcBase($row['base']);
            $subEntity->setKomment($row['komment']);

            if ($subEntity->getId()) {
                $ids[] = $subEntity->getId();
            }
        }

        $data['ground'] = $this->entityManager->getReference(Ground::class, $data['groundId']);
        unset($data['rows']);
        unset($data['groundId']);
        $data['date'] = new \DateTime($data['date']);
        $data['updated'] = new \DateTime();

        if ($this->isNewEntity) {
            $data['created'] = new \DateTime();
        }

        /** @var AccurringRow $row */
        foreach ($entity->getRows() as $row) {
            if (!in_array($row->getId(), $ids)) {
                $row->setIsDeleted(true);
            }
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}
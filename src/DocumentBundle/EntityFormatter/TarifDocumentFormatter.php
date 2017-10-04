<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use DocumentBundle\Entity\TarifDocument;
use DocumentBundle\Entity\TarifRow;
use KontragentBundle\Entity\Service;

class TarifDocumentFormatter extends EntityFormatterAbstract
{
    protected $entityClass = TarifDocument::class;

    /**
     * @param TarifDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        $rows = [];

        /** @var TarifRow $row */
        foreach ($entity->getRows() as $row) {
            $rows[] = [
                'id' => $row->getId(),
                'serviceId' => $row->getService()->getId(),
                'service' => $row->getService()->getName(),
                'price' => $row->getPrice()
            ];
        }

        return [
            'id' => $entity->getId(),
            'dateStart' => $entity->getDateStart()->format('Y-m-d'),
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
        $entity = $this->getEntity($id, 'createTarifDocument');

        if (!$entity) {
            return false;
        }
        
        foreach ($data['rows'] as $row) {
            if ($row['id']) {
                $subEntity = $this->entityManager->getRepository(TarifRow::class)->find($row['id']); 
            } else {
                $subEntity = $this->entityFactory->createTarifRow();
                $subEntity->setCreated(new \DateTime());
                $subEntity->setIsDeleted(false);

                $this->entityManager->persist($subEntity);
            }

            $service = $this->entityManager->getReference(Service::class, $row['serviceId']);

            $subEntity->setService($service);
            $subEntity->setUpdated(new \DateTime());
            $subEntity->setPrice($row['price']);
            $subEntity->setDocument($entity);
        }

        unset($data['rows']);
        $data['dateStart'] = new \DateTime($data['dateStart']);
        $data['updated'] = new \DateTime();

        if ($this->isNewEntity) {
            $data['created'] = new \DateTime();
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}
<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use DocumentBundle\Entity\ServiceDocument;
use DocumentBundle\Entity\ServiceRow;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;
use KontragentBundle\Entity\Service;
use KontragentBundle\Helper\KontragentHelper;

class ServiceDocumentFormatter extends EntityFormatterAbstract
{
    protected $entityClass = ServiceDocument::class;

    /**
     * @param ServiceDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        $rows = [];

        /** @var ServiceRow $row */
        foreach ($entity->getRows() as $row) {
            if ($row->isDeleted()) {
                continue;
            }

            $rows[] = [
                'id' => $row->getId(),
                'service' => $row->getService()->getName(),
                'serviceId' => $row->getService()->getId(),
                'ground' => $row->getGround()->getAccNumber(),
                'groundId' => $row->getGround()->getId(),
                'date' => $row->getDate()->format('Y-m-d'),
                'price' => $row->getPrice(),
                'count' => $row->getCount(),
                'sum' => $row->getSum()
            ];
        }

        return [
            'id' => $entity->getId(),
            'created' => $entity->getCreated()->format('Y-m-d'),
            'date' => $entity->getDate()->format('Y-m-d'),
            'rows' => $rows,
            'kontragent' => KontragentHelper::getShortName($entity->getKontragent()),
            'kontragentId' => $entity->getKontragent()->getId()
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|bool
     */
    public function setData($id, array $data)
    {
        /** @var ServiceDocument $entity */
        $entity = $this->getEntity($id, 'createServiceDocument');

        if (!$entity) {
            return false;
        }

        $ids = [];
        foreach ($data['rows'] as $row) {
            if ($row['id']) {
                $subEntity = $this->entityManager->getRepository(ServiceRow::class)->find($row['id']);
            } else {
                $subEntity = $this->entityFactory->createServiceRow();
                $subEntity->setCreated(new \DateTime());
                $subEntity->setIsDeleted(false);

                $this->entityManager->persist($subEntity);
            }

            $service = $this->entityManager->getReference(Service::class, $row['serviceId']);
            $ground = $this->entityManager->getReference(Ground::class, $row['groundId']);

            $subEntity->setGround($ground);
            $subEntity->setService($service);
            $subEntity->setCount($row['count']);
            $subEntity->setDate(new \DateTime($row['date']));
            $subEntity->setPrice($row['price']);
            $subEntity->setSum($row['sum']);
            $subEntity->setUpdated(new \DateTime());
            $subEntity->setDocument($entity);

            if ($subEntity->getId()) {
                $ids[] = $subEntity->getId();
            }
        }

        unset($data['rows']);
        $data['updated'] = new \DateTime();
        $data['date'] = new \DateTime($data['date']);
        $data['kontragent'] = $this->entityManager->getReference(Kontragent::class, $data['kontragentId']);

        if ($this->isNewEntity) {
            $data['created'] = new \DateTime();
        }

        /** @var ServiceRow $row */
        foreach ($entity->getRows() as $row) {
            if (!in_array($row->getId(), $ids)) {
                $row->setIsDeleted(true);
            }
        }

        $this->fillEntity($data, $entity);

        return $entity;
    }
}
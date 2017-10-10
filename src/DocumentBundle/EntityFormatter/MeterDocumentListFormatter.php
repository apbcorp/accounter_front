<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use DocumentBundle\Entity\MeterDocument;

class MeterDocumentListFormatter extends EntityFormatterAbstract
{
    protected $entityClass = MeterDocument::class;

    /**
     * @param MeterDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        return [
            'id' => $entity->getId(),
            'created' => $entity->getCreated()->format('d-m-Y'),
            'date' => $entity->getDate()->format('d-m-Y')
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|bool
     */
    public function setData($id, array $data)
    {
        return false;
    }
}
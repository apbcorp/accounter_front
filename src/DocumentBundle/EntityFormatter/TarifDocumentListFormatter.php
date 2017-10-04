<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use DocumentBundle\Entity\TarifDocument;

class TarifDocumentListFormatter extends EntityFormatterAbstract
{
    protected $entityClass = TarifDocument::class;

    /**
     * @param TarifDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        return [
            'id' => $entity->getId(),
            'created' => $entity->getCreated()->format('d-m-Y'),
            'dateStart' => $entity->getDateStart()->format('d-m-Y')
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
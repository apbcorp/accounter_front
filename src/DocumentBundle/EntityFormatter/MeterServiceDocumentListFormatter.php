<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use DocumentBundle\Entity\MeterServiceDocument;
use KontragentBundle\Helper\GroundHelper;

class MeterServiceDocumentListFormatter extends EntityFormatterAbstract
{
    protected $entityClass = MeterServiceDocument::class;

    /**
     * @param MeterServiceDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        return [
            'id' => $entity->getId(),
            'created' => $entity->getCreated()->format('d-m-Y'),
            'date' => $entity->getDate()->format('d-m-Y'),
            'ground' => GroundHelper::getGroundWithShortName($entity->getGround())
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return MeterServiceDocument|bool
     */
    public function setData($id, array $data)
    {
        return false;
    }
}
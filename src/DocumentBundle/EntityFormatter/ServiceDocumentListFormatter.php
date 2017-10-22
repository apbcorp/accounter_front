<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use DocumentBundle\Entity\ServiceDocument;
use KontragentBundle\Helper\KontragentHelper;

class ServiceDocumentListFormatter extends EntityFormatterAbstract
{
    protected $entityClass = ServiceDocument::class;

    /**
     * @param ServiceDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        return [
            'id' => $entity->getId(),
            'created' => $entity->getCreated()->format('d-m-Y'),
            'date' => $entity->getDate()->format('d-m-Y'),
            'kontragent' => KontragentHelper::getShortName($entity->getKontragent())
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return ServiceDocument|bool
     */
    public function setData($id, array $data)
    {
        return false;
    }
}
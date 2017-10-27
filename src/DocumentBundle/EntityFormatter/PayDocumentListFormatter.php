<?php

namespace DocumentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use DocumentBundle\Entity\PayDocument;

class PayDocumentListFormatter extends EntityFormatterAbstract
{
    protected $entityClass = PayDocument::class;

    /**
     * @param PayDocument $entity
     * @return array
     */
    public function getData($entity)
    {
        return [
            'id' => $entity->getId(),
            'date' => $entity->getDate()->format('d-m-Y'),
            'kontragent' => implode(' ', [
                $entity->getKontragent()->getSurname(),
                $entity->getKontragent()->getName(),
                $entity->getKontragent()->getName2()
            ])
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
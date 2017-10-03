<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use KontragentBundle\Entity\Kontragent;

class KontragentListFormatter extends EntityFormatterAbstract
{
    /**
     * @param Kontragent $entity
     * @return array
     */
    public function getData($entity)
    {
        return [
            'id' => $entity->getId(),
            'name' => $entity->getName(),
            'surname' => $entity->getSurname(),
            'name2' => $entity->getName2(),
            'phone' => $entity->getPhone(),
            'adress' => $entity->getAdress()
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
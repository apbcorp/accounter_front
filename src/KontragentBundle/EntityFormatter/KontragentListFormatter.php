<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
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

    public function setData($id, array $data)
    {

    }
}
<?php

namespace KontragentBundle\EntityFormatter;

use CoreBundle\BaseClasses\EntityFormatterAbstract;
use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use KontragentBundle\Entity\Ground;
use KontragentBundle\Entity\Kontragent;

class KontragentFormatter extends EntityFormatterAbstract
{
    protected $entityClass = Kontragent::class;

    /**
     * @param Kontragent $entity
     * @return array
     */
    public function getData($entity)
    {
        $grounds = [];
        $formatter = $this->formatterFactory->getFormatter(Ground::class, 'list');

        foreach ($entity->getGrounds() as $record) {
            $grounds[] = $formatter->getData($record);
        }

        return [
            'id' => $entity->getId(),
            'name' => $entity->getName(),
            'surname' => $entity->getSurname(),
            'name2' => $entity->getName2(),
            'phone' => $entity->getPhone(),
            'adress' => $entity->getAdress(),
            'grounds' => $grounds
        ];
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface|bool
     */
    public function setData($id, array $data)
    {
        $entity = $this->getEntity($id, 'createKontragent');

        if (!$entity) {
            return false;
        }
        
        foreach ($data as $key => $value) {
            $method = $this->getSetter($key, $entity);

            if (!$method) {
                continue;
            }

            $entity->$method($value);
        }

        if ($this->isNewEntity) {
            $entity->setIsDeleted(false);
            $this->entityManager->persist($entity);
        }

        return $entity;
    }
}
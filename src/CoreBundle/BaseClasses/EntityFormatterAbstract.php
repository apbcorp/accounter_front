<?php

namespace CoreBundle\BaseClasses;

use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use CoreBundle\Factory\EntityFactory;
use CoreBundle\Factory\EntityFormatterFactory;
use Doctrine\ORM\EntityManager;
use Symfony\Component\HttpFoundation\Request;

abstract class EntityFormatterAbstract
{
    /**
     * @var EntityFactory
     */
    protected $entityFactory;

    /**
     * @var EntityFormatterFactory
     */
    protected $formatterFactory;

    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * @var string
     */
    protected $entityClass;

    /**
     * @var bool
     */
    protected $isNewEntity;

    /**
     * EntityFormatterAbstract constructor.
     * @param EntityFactory $entityFactory
     * @param EntityFormatterFactory $formatterFactory
     * @param EntityManager $entityManager
     */
    public function __construct(EntityFactory $entityFactory, EntityFormatterFactory $formatterFactory, EntityManager $entityManager)
    {
        $this->entityFactory = $entityFactory;
        $this->formatterFactory = $formatterFactory;
        $this->entityManager = $entityManager;
    }

    /**
     * @param int $id
     * @return array
     */
    public function getDataById($id)
    {
        $entity = $this->entityManager->getRepository($this->entityClass)->find($id);

        return $this->getData($entity);
    }

    /**
     * @param EntityInterface $entity
     * @return array
     */
    public abstract function getData($entity);

    /**
     * @param int $id
     * @param Request $request
     * @return EntityInterface
     */
    public function setDataByRequest($id, Request $request)
    {
        $data = $request->request->all();

        return $this->setData($id, $data);
    }

    /**
     * @param int $id
     * @param array $data
     * @return EntityInterface
     */
    public abstract function setData($id, array $data);

    /**
     * @param string          $field
     * @param EntityInterface $entity
     * @return string
     */
    protected function getSetter($field, EntityInterface $entity)
    {
        $method = 'set' . ucfirst($field);
        if (method_exists($entity, $method)) {
            return $method;
        }

        $method = 'is' . ucfirst($field);
        if (method_exists($entity, $method)) {
            return $method;
        }

        return '';
    }

    /**
     * @param $id
     * @param $createMethod
     * @return EntityInterface
     */
    protected function getEntity($id, $createMethod)
    {
        if (!$id) {
            $this->isNewEntity = true;
            
            return $this->entityFactory->$createMethod();
        }
        
        $this->isNewEntity = false;
        
        return $this->entityManager->getRepository($this->entityClass)->find($id);
    }

    /**
     * @param $data
     * @param EntityInterface $entity
     */
    protected function fillEntity($data, EntityInterface $entity)
    {
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
    }
}
<?php

namespace CoreBundle\Controller;

use CoreBundle\BaseClasses\Interfaces\EntityInterface;
use CoreBundle\Factory\EntityFormatterFactory;
use Doctrine\ORM\EntityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;

class BaseController extends Controller
{
    /**
     * @var string
     */
    protected $entity;

    /**
     * @var EntityRepository
     */
    protected $repository;

    /**
     * @var EntityFormatterFactory
     */
    protected $formatterFactory;

    /**
     * @param string[] $data
     * @param int      $code
     * @param array    $headers
     *
     * @return JsonResponse
     */
    protected function sendResponse($data, $code, $headers = [])
    {
        /** @var EntityFormatterFactory $formatterFactory */
        $formatterFactory = $this->get('core.factory.entity_formatter');
        
        $response = (new JsonResponse())
            ->setEncodingOptions(JSON_UNESCAPED_UNICODE)
            ->setStatusCode($code);

        if (!$data) {
            $data = [];
        }

        if (substr($code, 0, 1) != 2) {
            $response->setData([
                'status' => 'error',
                'result' => $data,
            ]);
        } else {
            if (is_array($data)) {
                foreach ($data as &$record) {
                    $record = $this->convertObject($record, 'list');
                }
            } else {
                $data = $this->convertObject($data, '');
            }

            $response->setData([
                'status' => 'success',
                'result' => $data,
            ]);
        }

        return $response;
    }

    /**
     * @param mixed  $var
     * @param string $type
     * @return array
     */
    private function convertObject($var, $type)
    {
        if (!is_object($var)) {
            return $var;
        }
        if (! $var instanceof EntityInterface) {
            return (array) $var;
        }

        $entityClass = get_class($var);
        $formatter = $this->getFormatterFactory()->getFormatter($entityClass, $type);

        return $formatter->getData($var);
    }

    /**
     * @return EntityRepository
     */
    protected function getRepository()
    {
        if (!$this->repository) {
            $this->repository = $this->getDoctrine()->getManager()->getRepository($this->entity);
        }

        return $this->repository;
    }

    protected function getFormatterFactory()
    {
        if (!$this->formatterFactory) {
            $this->formatterFactory = $this->get('core.factory.entity_formatter');
        }

        return $this->formatterFactory;
    }
}

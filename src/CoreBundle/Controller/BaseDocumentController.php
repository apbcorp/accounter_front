<?php

namespace CoreBundle\Controller;

use CoreBundle\Service\TokenService;
use CoreBundle\Struct\FilterStruct;
use CoreBundle\Factory\StructFactory;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class BaseDocumentController extends BaseController
{
    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getAction($id)
    {
        $entity = $this->getRepository()->find($id);
        
        if (method_exists($entity, 'getUnitId') && $entity->getUnitId() != $this->getUnitId()) {
            return $this->sendResponse([], Response::HTTP_NOT_FOUND);
        }
        
        return $this->sendResponse($entity, Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function listAction(Request $request)
    {
        $params = $this->getParams($request);

        return $this->sendResponse(
            $this->getRepository()->getList(
                $params->getFilter(),
                $params->getOrder(),
                $params->getLimit(),
                $params->getOffset(),
                $this->getUnitId()
            ),
            Response::HTTP_OK
        );
    }

    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function deleteAction($id)
    {
        $entity = $this->getRepository()->find($id);
        $entity->setIsDeleted(true);

        if (method_exists($entity, 'getRows')) {
            foreach ($entity->getRows() as $row) {
                $row->setIsDeleted(true);
            }
        }

        $this->getDoctrine()->getManager()->flush();

        return $this->sendResponse([$id => true], Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @param $id
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function patchAction(Request $request, $id)
    {
        $formatter = $this->getFormatterFactory()->getFormatter($this->entity);
        $formatter->setDataByRequest($id, $request, $this->getUnitId());
        $this->getDoctrine()->getManager()->flush();

        return $this->sendResponse(['id' => $id], Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function postAction(Request $request)
    {
        $formatter = $this->getFormatterFactory()->getFormatter($this->entity);
        $entity = $formatter->setDataByRequest(null, $request, $this->getUnitId());
        $this->getDoctrine()->getManager()->flush();

        return $this->sendResponse(['id' => $entity->getId()], Response::HTTP_CREATED);
    }

    /**
     * @param Request $request
     * @return FilterStruct
     */
    protected function getParams(Request $request)
    {
        /** @var StructFactory $factory */
        $factory = $this->get('core.factory.struct');
        $struct = $factory->getFilterStruct();
        $struct->parse($request);

        return $struct;
    }

    /**
     * @return int
     * @throws \Exception
     */
    protected function getUnitId()
    {
        /** @var TokenService $tokenService */
        $tokenService = $this->get('auth.service.token');
        $units = $tokenService->getTokenEntity()->getUser()->getUnits();

        if (!$units || count($units) > 1) {
            throw new \Exception('This user can\t add new records');
        } else {
            return $units[0];
        }
    }
}
<?php

namespace CoreBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use CoreBundle\Struct\FilterStruct;
use CoreBundle\Factory\StructFactory;

class BaseEntityController extends BaseController
{
    /**
     * @param $id
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function getAction($id)
    {
        return $this->sendResponse($this->getRepository()->find($id), Response::HTTP_OK);
    }

    /**
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\JsonResponse
     */
    public function listAction(Request $request)
    {
        $params = $this->getParams($request);

        return $this->sendResponse(
            $this->getRepository()->findBy(
                $params->getFilter(),
                $params->getOrder(),
                $params->getLimit(),
                $params->getOffset()
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
        $entity->isDeleted(true);

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
        $formatter->setDataByRequest($id, $request);
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
        $entity = $formatter->setDataByRequest(null, $request);
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
}